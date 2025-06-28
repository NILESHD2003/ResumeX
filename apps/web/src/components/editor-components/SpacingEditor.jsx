import { useEffect, useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const SpacingControl = ({
  label,
  value,
  unit,
  onChange,
  min = 0,
  max = 100,
  step = 1
}) => {
  const handleDecrease = () => {
    const newValue = +(value - step).toFixed(2);
    if (newValue >= min) {
      onChange(newValue);
    }
  };

  const handleIncrease = () => {
    const newValue = +(value + step).toFixed(2);
    if (newValue <= max) {
      onChange(newValue);
    }
  };

  const totalBars = Math.round((max - min) / step) + 1;

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <Label className="text-sm text-gray-700">{label}</Label>
        <span className="text-sm text-gray-500">{value}{unit}</span>
      </div>

      <div className="flex items-center gap-2">
        {/* Slider */}
        <div className="flex-1 flex items-center gap-1">
          {[...Array(totalBars)].map((_, index) => {
            const segmentValue = +(min + index * step).toFixed(2);
            const isActive = segmentValue === +value.toFixed(2);
            return (
              <div
                key={index}
                className={`h-6 flex-1 rounded-sm cursor-pointer transition-colors ${
                  isActive
                    ? 'bg-blue-500'
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
                onClick={() => onChange(segmentValue)}
              />
            );
          })}
        </div>

        {/* - Button */}
        <Button
          type="button"
          onClick={handleDecrease}
          className="w-6 h-6 p-0"
          variant="secondary"
          size="icon"
          disabled={value <= min}
        >
          <Minus size={12} />
        </Button>

        {/* + Button */}
        <Button
          type="button"
          onClick={handleIncrease}
          className="w-6 h-6 p-0"
          variant="secondary"
          size="icon"
          disabled={value >= max}
        >
          <Plus size={12} />
        </Button>
      </div>
    </div>
  );
};


const SpacingEditor = ({resumeMetadata, setResumeMetadata}) => {
  const [fontSize, setFontSize] = useState(resumeMetadata?.spacing?.fontSize || 11);
  const [lineHeight, setLineHeight] = useState(resumeMetadata?.spacing?.lineHeight || 1.1);
  const [leftRightMargin, setLeftRightMargin] = useState(resumeMetadata?.spacing?.yMargin || 10);
  const [topBottomMargin, setTopBottomMargin] = useState(resumeMetadata?.spacing?.xMargin || 10);
  const [spaceBetweenEntities, setSpaceBetweenEntities] = useState(resumeMetadata?.spacing?.spaceBetnEntries || 1);

  useEffect(() => {
    setResumeMetadata(prev => ({
      ...prev,
      spacing: {
        ...prev.spacing,
        fontSize: fontSize,
        lineHeight: lineHeight,
        xMargin: leftRightMargin,
        yMargin: topBottomMargin,
        spaceBetnEntries: spaceBetweenEntities
      }
    }));
  }, [fontSize, lineHeight, leftRightMargin, topBottomMargin, spaceBetweenEntities])

  return (
    <div className="w-full bg-white rounded-xl p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Spacing</h2>
      <SpacingControl
        label="Font Size"
        value={fontSize}
        unit="pt"
        onChange={setFontSize}
        min={9}
        max={13}
        step={0.5}
      />
      <SpacingControl
        label="Line Height"
        value={lineHeight}
        unit=""
        onChange={setLineHeight}
        min={1.1}
        max={1.5}
        step={0.05}
      />
      <SpacingControl
        label="Left & Right Margin"
        value={leftRightMargin}
        unit="mm"
        onChange={setLeftRightMargin}
        min={10}
        max={26}
        step={2}
      />
      <SpacingControl
        label="Top & Bottom Margin"
        value={topBottomMargin}
        unit="mm"
        onChange={setTopBottomMargin}
        min={10}
        max={26}
        step={2}
      />
      <SpacingControl
        label="Space between Entries"
        value={spaceBetweenEntities}
        unit=""
        onChange={setSpaceBetweenEntities}
        min={1}
        max={9}
        step={1}
      />
    </div>
  );
};

export default SpacingEditor;
