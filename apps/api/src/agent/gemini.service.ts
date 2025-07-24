import { Inject, Injectable, Logger } from '@nestjs/common';
import { GoogleGenAI } from '@google/genai';
import { ConfigService } from '@nestjs/config';
import { QuotasRepository } from 'src/repository/quotas.repository';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from '@nestjs/cache-manager';
import { WorkersManagementService } from 'src/agent/workers.service';

export class GeminiDegradationError extends Error {
  constructor(
    message: string,
    public degradationTime: number,
  ) {
    super(message);
    this.name = 'GeminiDegradationError';
  }
}

export class GeminiRateLimitError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'GeminiRateLimitError';
  }
}

export class GeminiServiceError extends Error {
  constructor(
    message: string,
    public isRetryable: boolean = true,
  ) {
    super(message);
    this.name = 'GeminiServiceError';
  }
}

@Injectable()
export class GeminiService {
  private ai: GoogleGenAI;
  private readonly GEMINI_2DOT0_FLASH_RPM: number;
  private readonly GEMINI_2DOT0_FLASH_RPD: number;
  private readonly GEMINI_2DOT0_FLASH_TPM: number;

  private readonly GEMINI_2DOT0_FLASH_LITE_RPM: number;
  private readonly GEMINI_2DOT0_FLASH_LITE_RPD: number;
  private readonly GEMINI_2DOT0_FLASH_LITE_TPM: number;

  private readonly GEMINI_2DOT5_FLASH_PREVIEW_04_17_RPM: number;
  private readonly GEMINI_2DOT5_FLASH_PREVIEW_04_17_RPD: number;
  private readonly GEMINI_2DOT5_FLASH_PREVIEW_04_17_TPM: number;

  private readonly logger = new Logger(GeminiService.name);

  private degradeCount = 0;

  constructor(
    private configService: ConfigService,
    private quotasRepository: QuotasRepository,
    private workersManagementService: WorkersManagementService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (!apiKey) {
      this.logger.error('GEMINI_API_KEY is not configured');
    }
    this.ai = new GoogleGenAI({
      apiKey,
    });

    this.GEMINI_2DOT0_FLASH_RPM = this.configService.get<number>(
      'GEMINI_2DOT0_FLASH_RPM',
    );
    this.GEMINI_2DOT0_FLASH_RPD = this.configService.get<number>(
      'GEMINI_2DOT0_FLASH_RPD',
    );
    this.GEMINI_2DOT0_FLASH_TPM = this.configService.get<number>(
      'GEMINI_2DOT0_FLASH_TPM',
    );

    this.GEMINI_2DOT0_FLASH_LITE_RPM = this.configService.get<number>(
      'GEMINI_2DOT0_FLASH_LITE_RPM',
    );
    this.GEMINI_2DOT0_FLASH_LITE_RPD = this.configService.get<number>(
      'GEMINI_2DOT0_FLASH_LITE_RPD',
    );
    this.GEMINI_2DOT0_FLASH_LITE_TPM = this.configService.get<number>(
      'GEMINI_2DOT0_FLASH_LITE_TPM',
    );

    this.GEMINI_2DOT5_FLASH_PREVIEW_04_17_RPM = this.configService.get<number>(
      'GEMINI_2DOT5_FLASH_PREVIEW_04_17_RPM',
    );
    this.GEMINI_2DOT5_FLASH_PREVIEW_04_17_RPD = this.configService.get<number>(
      'GEMINI_2DOT5_FLASH_PREVIEW_04_17_RPD',
    );
    this.GEMINI_2DOT5_FLASH_PREVIEW_04_17_TPM = this.configService.get<number>(
      'GEMINI_2DOT5_FLASH_PREVIEW_04_17_TPM',
    );

    if (
      !this.GEMINI_2DOT0_FLASH_RPM ||
      !this.GEMINI_2DOT0_FLASH_RPD ||
      !this.GEMINI_2DOT0_FLASH_TPM ||
      !this.GEMINI_2DOT0_FLASH_LITE_RPM ||
      !this.GEMINI_2DOT0_FLASH_LITE_RPD ||
      !this.GEMINI_2DOT0_FLASH_LITE_TPM ||
      !this.GEMINI_2DOT5_FLASH_PREVIEW_04_17_RPM ||
      !this.GEMINI_2DOT5_FLASH_PREVIEW_04_17_RPD ||
      !this.GEMINI_2DOT5_FLASH_PREVIEW_04_17_TPM
    ) {
      this.logger.error('Gemini Rate Limit Configurations are not set');
    }

    this.logger.log('Gemini Rate Limit Configurations are set');
  }

  async generateContent(model, config, contents) {
    try {
      // Check if the system is degraded
      const isDegraded = await this.cacheManager.get('system:degraded');
      if (isDegraded) {
        throw new GeminiDegradationError(
          'Gemini service is currently degraded. Jobs will be retried when service recovers.',
          await this.cacheManager.ttl('system:degraded'),
        );
      }
      // //simulating a graceful degradation --- TEMP
      // if (this.degradeCount == 0) {
      //   this.logger.log('Simulating graceful degradation for Gemini Service');
      //   throw new Error('Simulated degradation for testing');
      // }
      // //simulating a graceful degradation --- TEMP
      if (
        !contents ||
        !contents.length ||
        !contents[0].parts ||
        !contents[0].parts.length
      ) {
        throw new Error('Invalid contents structure provided');
      }

      contents.forEach((content) => {
        content.parts.forEach((part) => {
          if (!part.text && !part.inlineData) {
            throw new Error('Each part must have either text or inlineData');
          }
        });
      });

      const isRateLimitExceeded = await this.checkRateLimit(model);

      if (!isRateLimitExceeded) {
        throw new GeminiRateLimitError('Rate Limit Exceeded');
      }

      const response = await this.ai.models.generateContent({
        model,
        config,
        contents,
      });

      if (!response || !response.candidates || !response.candidates.length) {
        throw new GeminiServiceError('Empty or invalid response from Gemini API');
      }

      const candidateContent = response.candidates[0].content;
      if (
        !candidateContent ||
        !candidateContent.parts ||
        !candidateContent.parts.length
      ) {
        throw new GeminiServiceError('No content parts found in Gemini response');
      }

      this.manageRateLimit(model, response.usageMetadata.totalTokenCount);

      const textContent = candidateContent.parts[0].text;

      return textContent;
    } catch (error) {
      this.logger.error('Error while making Gemini Service Call', error);

      if (error instanceof GeminiDegradationError) {
        throw error;
      }

      if (error instanceof GeminiRateLimitError) {
        throw error;
      }

      if (error instanceof GeminiServiceError && !error.isRetryable) {
        throw error;
      }

      await this.handleDegradation();

      throw new GeminiDegradationError(
        'Gemini service encountered an error and is now degraded. Jobs will be retried.',
        this.getDegradationTime()
      );
    }
  }

  private manageRateLimit(model: string, usage: number) {
    this.quotasRepository.setGlobalQuotaUsage(model, 1, 'rpm');
    this.quotasRepository.setGlobalQuotaUsage(model, Number(usage), 'tpm');
    this.quotasRepository.setGlobalQuotaUsage(model, 1, 'rpd');
    this.quotasRepository.setGlobalQuotaUsage(model, Number(usage), 'tpd');
  }

  async checkRateLimit(model: string) {
    const rpm: number =
      (await this.quotasRepository.getGlobalQuotaUsage(model, 'rpm')) || 0;
    const tpm: number =
      (await this.quotasRepository.getGlobalQuotaUsage(model, 'tpm')) || 0;
    const rpd: number =
      (await this.quotasRepository.getGlobalQuotaUsage(model, 'rpd')) || 0;

    let currentModel: string;

    if (model === 'gemini-2.0-flash') {
      currentModel = 'GEMINI_2DOT0_FLASH';
    } else if (model === 'gemini-2.0-flash-lite') {
      currentModel = 'GEMINI_2DOT0_FLASH_LITE';
    } else if (model === 'gemini-2.5-flash-preview-04-17') {
      currentModel = 'GEMINI_2DOT5_FLASH_PREVIEW_04_17';
    }

    if (!currentModel) {
      this.logger.error('Invalid Model', model);
      return false;
    }

    if (Number(rpd) >= Number(this[currentModel + '_RPD'])) return false;

    if (Number(tpm) >= Number(this[currentModel + '_TPM'])) return false;

    if (Number(rpm) >= Number(this[currentModel + '_RPM'])) return false;

    // this.logger.debug('Rate Limit Check Passed', model);
    return true;
  }

  private async handleDegradation() {
    let degradationTime: number;

    if (this.degradeCount < 1) {
      this.degradeCount++;
      degradationTime = 60; // 60 seconds
    } else if (this.degradeCount < 2) {
      this.degradeCount++;
      degradationTime = 120; // 120 seconds
    } else if (this.degradeCount < 3) {
      this.degradeCount++;
      degradationTime = 300; // 300 seconds
    } else {
      degradationTime = 600; // 600 seconds
    }

    await this.degradeGemini(degradationTime);
  }

  private getDegradationTime(): number {
    if (this.degradeCount < 1) return 60;
    if (this.degradeCount < 2) return 120;
    if (this.degradeCount < 3) return 300;
    return 600;
  }

  async degradeGemini(time: number) {
    this.logger.warn('Triggered Gemini Degradation for ' + time + ' seconds');
    
    // Set degradation flag
    await this.cacheManager.set('system:degraded', true, time * 1000);
    
    // Pause all workers
    this.logger.log('Pausing all workers due to Gemini degradation');
    await this.workersManagementService.pauseAllWorkers();

    // Schedule worker resumption
    setTimeout(async () => {
      try {
        this.logger.log(`Resuming workers after ${time} seconds of degradation`);
        await this.workersManagementService.resumeAllWorkers();
        
        // Retry failed jobs immediately upon recovery
        this.logger.log('Retrying failed jobs immediately after degradation recovery');
        await this.workersManagementService.retryFailedJobs();
        
        this.logger.warn(`Resumed Workers after ${time} seconds`);
      } catch (error) {
        this.logger.error('Error resuming workers after degradation:', error);
      }
    }, time * 1000);
  }
}
