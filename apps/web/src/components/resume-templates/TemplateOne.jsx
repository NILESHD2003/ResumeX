import { format } from "date-fns";
import {
  Globe,
  Apple,
  Play,
  Link as LinkIcon,
} from "lucide-react";

const platformIcons = {
  WEBSITE: Globe,
  APP_STORE: Apple,
  PLAY_STORE: Play,
  OTHER: LinkIcon,
};

const GitHubIcon = ({size}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-github-icon"
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const TemplateOne = ({ data }) => {
    const {
    personalDetails,
    profileSummary,
    educationDetails,
    skills,
    professionalExperience,
    languages,
    certificates,
    projects,
    awards,
    courses,
    organizations,
    publications,
    references,
    declaration,
  } = data;

    return (
        <div className="w-[210mm] h-auto min-h-[297mm] p-10 bg-white text-black mx-auto print:bg-white print:text-black print:p-10 print:w-[210mm] print:h-[297mm] print:overflow-hidden">
            {/* Header */}
            {personalDetails && (
              <div className="text-center border-b pb-4">
                  <h1 className="text-3xl font-bold">{personalDetails.fullName}</h1>
                  <p className="italic text-lg">{personalDetails.jobTitle}</p>
                  <div className="flex justify-center flex-wrap gap-4 mt-2 text-sm">
                  <span>📞 {personalDetails.phone}</span>
                  <span>✉️ {personalDetails.email}</span>
                  <span>📍 {personalDetails.location}</span>
                  {personalDetails.socialLinks.map((link) => (
                      <a
                      key={link.platform}
                      href={link.url}
                      className="underline"
                      target="_blank"
                      rel="noreferrer"
                      >
                      {link.platform.toLowerCase() + ".com"}
                      </a>
                  ))}
                  </div>
              </div>
            )}

            {/* Education */}
            {educationDetails && (
              <div>
                <Section title="Education">
                    {educationDetails.map((edu) => (
                    <Education
                        key={edu._id}
                        title={edu.degree}
                        subtitle={edu.school}
                        grade={edu.grade}
                        location={`${edu.city}, ${edu.country}`}
                        date={`${formatDate(edu.startDate)} - ${formatDate(edu.endDate)}`}
                        description={edu.description}
                    />
                    ))}
                </Section>
              </div>
            )}


            {/* Skills */}
            {skills && (
              <div>
                <Section title="Skills">
                  <div className="grid grid-cols-2">
                      {skills.map((skill) => (
                      <div key={skill._id}>
                          <strong>{skill.name} — {skill.level.toLowerCase()}</strong>
                          <ul className="list-disc list-inside ml-4">
                          {skill.subSkills.map((s, idx) => (
                              <li key={idx}>{s}</li>
                          ))}
                          </ul>
                      </div>
                      ))}
                  </div>
                </Section>
              </div>
            )}

            {/* Professional Experience */}
            {professionalExperience && (
              <div>
                <Section title="Professional Experience">
                    {professionalExperience.map((exp) => (
                    <ProfessionalExp
                        key={exp._id}
                        title={exp.employer}
                        subtitle={exp.jobTitle}
                        location={`${exp.city}, ${exp.country}`}
                        date={`${formatDate(exp.startDate)} - ${formatDate(exp.endDate)}`}
                        description={exp.description}
                    />
                    ))}
                </Section>
              </div>
            )}

            {/* Languages */}
            {languages && (
              <div>
                <Section title="Languages">
                  <div className="grid grid-cols-2">
                    {languages.map((lang) => (
                    <div key={lang._id}>
                        <strong>{lang.name} </strong> — {lang.level.toLowerCase()}
                        <p>{lang.additionalInfo}</p>
                    </div>
                    ))}
                  </div>
                </Section>
              </div>
            )}

            {/* Certificates */}
            {certificates && (
              <div>
                <Section title="Certificates">
                    {certificates.map((cert) => (
                    <Certificates
                        key={cert._id}
                        title={cert.title}
                        subtitle={cert.issuer}
                        date={formatDate(cert.date)}
                        description={cert.additionalInfo}
                    />
                    ))}
                </Section>
              </div>
            )}

            {/* Projects */}
            {projects && (
              <div>
                <Section title="Projects">
                    {projects.map((proj) => (
                      <Project
                        key={proj._id}
                        title={proj.title}
                        subtitle={proj.subtitle}
                        description={proj.description}
                        startDate={proj.startDate}
                        endDate={proj.endDate}
                        links={proj.links}
                      />
                    ))}
                </Section>
              </div>
            )}

            {/* Awards */}
            {awards && (
              <div>
                <Section title="Awards">
                    {awards.map((award) => (
                    <Award
                        key={award._id}
                        title={award.title}
                        issuer={award.issuer}
                        date={formatDate(award.date)}
                        link={award.link}
                    />
                    ))}
                </Section>
              </div>
            )}

            {courses && (
              <div>
                <Section title="Courses">
                    {courses.map((course) => (
                    <Course
                        key={course._id}
                        title={course.title}
                        issuer={course.issuer}
                        date={`${formatDate(course.date)} - ${formatDate(course.expirationDate)}`}
                        link={course.link}
                        description={course.additionalInfo}
                    />
                    ))}
                </Section>
              </div>
            )}

            {organizations && (
              <div>
                <Section title="Organization">
                    {organizations.map((organization) => (
                    <Organization
                        key={organization._id}
                        title={organization.name}
                        date={`${formatDate(organization.startDate)} - ${formatDate(organization.endDate)}`}
                        link={organization.link}
                        description={organization.description}
                        location={`${organization.city}, ${organization.country}`}
                    />
                    ))}
                </Section>
              </div>
            )}

            {publications && (
              <div>
                <Section title="Publications">
                    {publications.map((publication) => (
                    <Publication
                        key={publication._id}
                        title={publication.title}
                        publisher={publication.publisher}
                        date={formatDate(publication.date)}
                        link={publication.link}
                        description={publication.description}
                    />
                    ))}
                </Section>
              </div>
            )}

            {references && (
              <div>
                <Section title="References">
                    {references.map((reference) => (
                    <Reference
                        key={reference._id}
                        name={reference.name}
                        jobTitle={reference.jobTitle}
                        organization={reference.organization}
                        link={reference.link}
                        email={reference.email}
                        phone={reference.phone}
                    />
                    ))}
                </Section>
              </div>
            )}
        </div>
    )
}

const Section = ({ title, children }) => (
  <section className="mt-6">
    <h2 className="text-xl font-semibold border-b mb-2">{title}</h2>
    <div className="space-y-2 text-sm">{children}</div>
  </section>
);

const Item = ({ title, subtitle, location, date, description }) => (
  <div>
    <div className="flex justify-between">
      <div>
        <strong>{title}</strong>
        {subtitle && <p className="italic text-sm">{subtitle}</p>}
      </div>
      {date && <div className="text-sm text-right whitespace-nowrap">{date}</div>}
    </div>
    {location && <p className="text-sm">{location}</p>}
    {description && <p className="text-sm text-gray-700">{description}</p>}
  </div>
);

const Reference = ({ name, jobTitle, organization, link, email, phone }) => (
  <div>
    <div>
      <div className="flex flex-wrap gap-2">
        <p><strong>{name}</strong>, {jobTitle}, {organization}</p>
        {link && (
            <a
              href={link}
              target="_blank"
              rel="noreferrer"
              className="underline flex items-center gap-1 text-sm"
            >
              <LinkIcon size={14}/>
            </a>
          )}
      </div>
    </div>
    <div>
      <p>{email}, {phone}</p>
    </div>
  </div>
);

const Award = ({ title, link, date, issuer }) => (
  <div>
    <div className="flex justify-between">
      <div>
        <div className="flex flex-wrap gap-2">
          <strong>{title}</strong>
          {link && (
            <a
              href={link}
              target="_blank"
              rel="noreferrer"
              className="underline flex items-center gap-1 text-sm"
            >
              <LinkIcon size={14}/>
            </a>
          )}

        </div>
        {issuer && <p className="italic text-sm">{issuer}</p>}
      </div>
      {date && <div className="text-sm text-right whitespace-nowrap">{date}</div>}
    </div>
  </div>
);

const Publication = ({ title, link, date, publisher, description }) => (
  <div>
    <div className="flex justify-between">
      <div>
        <div className="flex flex-wrap gap-2">
          <strong>{title}</strong>
          {link && (
            <a
              href={link}
              target="_blank"
              rel="noreferrer"
              className="underline flex items-center gap-1 text-sm"
            >
              <LinkIcon size={14}/>
            </a>
          )}

        </div>
        {publisher && <p className="italic text-sm">{publisher}</p>}
      </div>
      {date && <div className="text-sm text-right whitespace-nowrap">{date}</div>}
    </div>
    {description && <p className="text-sm text-gray-700">{description}</p>}
  </div>
);

const Course = ({ title, link, date, issuer, description }) => (
  <div>
    <div className="flex justify-between">
      <div>
        <div className="flex flex-wrap gap-2">
          <strong>{title}</strong>
          {link && (
            <a
              href={link}
              target="_blank"
              rel="noreferrer"
              className="underline flex items-center gap-1 text-sm"
            >
              <LinkIcon size={14}/>
            </a>
          )}

        </div>
        {issuer && <p className="italic text-sm">{issuer}</p>}
      </div>
      {date && <div className="text-sm text-right whitespace-nowrap">{date}</div>}
    </div>
    {description && <p className="text-sm text-gray-700">{description}</p>}
  </div>
);

const Organization = ({ title, link, date, description, location }) => (
  <div>
    <div className="flex justify-between">
      <div>
        <div className="flex flex-wrap gap-2">
          <strong>{title}</strong>
          {link && (
            <a
              href={link}
              target="_blank"
              rel="noreferrer"
              className="underline flex items-center gap-1 text-sm"
            >
              <LinkIcon size={14}/>
            </a>
          )}

        </div>
      </div>
      <div className="text-sm text-right whitespace-nowrap">
        {(date || location) && (
          <div>
            {date}
            {location && ` | ${location}`}
          </div>
        )}
      </div>
    </div>
    {description && <p className="text-sm text-gray-700">{description}</p>}
  </div>
);

const Certificates = ({ title, subtitle, location, date, description }) => (
  <div>
    <div className="flex justify-between">
      <div>
        <strong>{title}</strong>
        {subtitle && <p className="italic text-sm">{subtitle}</p>}
      </div>
      {date && <div className="text-sm text-right whitespace-nowrap">{date}</div>}
    </div>
    {location && <p className="text-sm">{location}</p>}
    {description && <p className="text-sm text-gray-700">{description}</p>}
  </div>
);

const Education = ({ title, subtitle, location, grade, date, description }) => (
  <div>
    <div className="flex justify-between">
      <div>
        <strong>{title}</strong>
        {subtitle && <p className="italic text-sm">{subtitle}</p>}
      </div>
      <div className="text-sm text-right whitespace-nowrap">
        {grade && <div>{grade}</div>}
        {(date || location) && (
          <div>
            {date}
            {location && ` | ${location}`}
          </div>
        )}
      </div>
    </div>
    {description && <p className="text-sm text-gray-700">{description}</p>}
  </div>
);

const ProfessionalExp = ({ title, subtitle, location, date, description }) => (
  <div>
    <div className="flex justify-between">
      <div>
        <strong>{title}</strong>
        {subtitle && <p className="italic text-sm">{subtitle}</p>}
      </div>
      <div className="text-sm text-right whitespace-nowrap">
        {(date || location) && (
          <div>
            {date}
            {location && ` | ${location}`}
          </div>
        )}
      </div>
    </div>
    {description && <p className="text-sm text-gray-700">{description}</p>}
  </div>
);

const Project = ({
  title,
  subtitle,
  description,
  startDate,
  endDate,
  links,
}) => {
  return (
    <div>
      <div className="flex justify-between">
        <div>
          {links?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <strong>{title}</strong>
              <div className="mt-0.5 text-sm">  
                {links.map((link, idx) => {
                  const IconComponent =
                    link.platform === "GITHUB"
                      ? GitHubIcon
                      : platformIcons[link.platform] || LinkIcon;

                  return (
                    <a
                      key={idx}
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      className="underline flex items-center gap-1"
                    >
                      <IconComponent size={14}/>
                    </a>
                  );
                })}
              </div>
            </div>
          )}
          {subtitle && <p className="italic text-sm">{subtitle}</p>}
        </div>

        <div className="text-sm text-right whitespace-nowrap">
          {formatDate(startDate)} - {formatDate(endDate)}
        </div>
      </div>

      {description && <p className="text-sm text-gray-700">{description}</p>}
    </div>
  );
};

const formatDate = (date) => {
  if (!date) return "Present";
  try {
    return format(new Date(date), "MM/yyyy");
  } catch {
    return "";
  }
};

export default TemplateOne;