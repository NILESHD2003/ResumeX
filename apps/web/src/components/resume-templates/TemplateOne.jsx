import { format } from "date-fns";
import {
  Globe,
  Apple,
  Play,
  Link as LinkIcon,
} from "lucide-react";
import parse from 'html-react-parser';

const platformIcons = {
  WEBSITE: Globe,
  APP_STORE: Apple,
  PLAY_STORE: Play,
  OTHER: LinkIcon,
};

const GitHubIcon = ({size}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="12"
    height="12"
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

const TemplateOne = ({ data, metadata }) => {
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

  const renderSection = (sectionKey) => {
  switch (sectionKey) {
    case "profileSummary":
        return profileSummary && (
          <div key="profileSummary">
            <Section title="Profile" style={metadata.heading} fontSize={metadata.spacing.fontSize}>
              <p>{[profileSummary]}</p>
            </Section>
            <div style={{ height: spaceBetnEntries }} className="w-full" />
          </div>
        );

      case "educationDetails":
        return educationDetails && (
          <div key="educationDetails">
            <Section title="Education" style={metadata.heading} fontSize={metadata.spacing.fontSize}>
              {educationDetails.map((edu) => (
                <Education
                  key={edu._id}
                  title={edu.degree}
                  subtitle={edu.school}
                  grade={edu.grade}
                  location={`${edu.city}, ${edu.country}`}
                  date={`${formatDate(edu.startDate)} - ${formatDate(edu.endDate)}`}
                  description={edu.description}
                  style={metadata.education}
                />
              ))}
            </Section>
            <div style={{ height: spaceBetnEntries }} className="w-full" />
          </div>
        );

      case "skills":
        return skills && (
          <div key="skills">
            <Section title="Skills" style={metadata.heading} fontSize={metadata.spacing.fontSize}>
              <Skills skills={skills} style={metadata.skills} />
            </Section>
            <div style={{ height: spaceBetnEntries }} className="w-full" />
          </div>
        );

      case "professionalExperience":
        return professionalExperience && (
          <div key="professionalExperience">
            <Section title="Professional Experience" style={metadata.heading} fontSize={metadata.spacing.fontSize}>
              {professionalExperience.map((exp) => (
                <ProfessionalExp
                  key={exp._id}
                  title={exp.employer}
                  subtitle={exp.jobTitle}
                  location={`${exp.city}, ${exp.country}`}
                  date={`${formatDate(exp.startDate)} - ${formatDate(exp.endDate)}`}
                  description={exp.description}
                  style={metadata.professionalExperience}
                />
              ))}
            </Section>
            <div style={{ height: spaceBetnEntries }} className="w-full" />
          </div>
        );

      case "languages":
        return languages && (
          <div key="languages">
            <Section title="Languages" style={metadata.heading} fontSize={metadata.spacing.fontSize}>
              <Languages languages={languages} style={metadata.languages} />
            </Section>
            <div style={{ height: spaceBetnEntries }} className="w-full" />
          </div>
        );

      case "certificates":
        return certificates && (
          <div key="certificates">
            <Section title="Certificates" style={metadata.heading} fontSize={metadata.spacing.fontSize}>
              {certificates.map((cert) => (
                <Certificates
                  key={cert._id}
                  certificates={certificates}
                  style={metadata.certificates}
                />
              ))}
            </Section>
            <div style={{ height: spaceBetnEntries }} className="w-full" />
          </div>
        );

      case "projects":
        return projects && (
          <div key="projects">
            <Section title="Projects" style={metadata.heading} fontSize={metadata.spacing.fontSize}>
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
            <div style={{ height: spaceBetnEntries }} className="w-full" />
          </div>
        );

      case "awards":
        return awards && (
          <div key="awards">
            <Section title="Awards" style={metadata.heading} fontSize={metadata.spacing.fontSize}>
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
            <div style={{ height: spaceBetnEntries }} className="w-full" />
          </div>
        );

      case "courses":
        return courses && (
          <div key="courses">
            <Section title="Courses" style={metadata.heading} fontSize={metadata.spacing.fontSize}>
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
            <div style={{ height: spaceBetnEntries }} className="w-full" />
          </div>
        );

      case "organizations":
        return organizations && (
          <div key="organizations">
            <Section title="Organization" style={metadata.heading} fontSize={metadata.spacing.fontSize}>
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
            <div style={{ height: spaceBetnEntries }} className="w-full" />
          </div>
        );

      case "publications":
        return publications && (
          <div key="publications">
            <Section title="Publications" style={metadata.heading} fontSize={metadata.spacing.fontSize}>
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
            <div style={{ height: spaceBetnEntries }} className="w-full" />
          </div>
        );

      case "references":
        return references && (
          <div key="references">
            <Section title="References" style={metadata.heading} fontSize={metadata.spacing.fontSize}>
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
            <div style={{ height: spaceBetnEntries }} className="w-full" />
          </div>
        );

      
    default:
      return null;
  }
};

  const baseFontSize = metadata.spacing.fontSize ?? 10;
  const nameSizeOption = metadata.name.nameSize ?? 'M'; // Default to 'M' for nameSize
  const jobTitleSizeOption = metadata.jobTitle.jobTitleSize ?? 'M'; // Default to 'M' for jobTitleSize

  const calculatedNameFontSize = calculateNameFontSize(baseFontSize, nameSizeOption);
  const calculatedJobTitleFontSize = calculateJobTitleFontSize(baseFontSize, nameSizeOption, jobTitleSizeOption);
  const lineHeight = metadata.spacing.lineHeight ?? 1.3;
  const spaceBetnEntries = 10 + (metadata.spacing.spaceBetnEntries * 2);


  return (
  <div
    style={{
      fontFamily: metadata.font.fontFamily,
      paddingLeft: `${metadata.spacing.xMargin}mm`,
      paddingRight: `${metadata.spacing.xMargin}mm`,
      paddingTop: `${metadata.spacing.yMargin}mm`,
      paddingBottom: `${metadata.spacing.yMargin}mm`,
      lineHeight: lineHeight,
    }}
    className="print:p-0  w-[210mm] h-auto min-h-[297mm] bg-[#ffffff] shadow-lg print:shadow-none text-[#000000] mx-auto print:text-[#000000] print:w-[210mm] print:h-[297mm]"
  >
    {/* Header */}

    {/* Layout rendering */}
    {metadata.layout.columns === "two" && metadata.layout.twoRowSectionArrangement ? (
      <>
        {personalDetails && metadata.layout.headerPosition === "top" &&(
          <div className="text-center pb-4">
            <h1
              style={{
                fontFamily: metadata.name.creativeFontOption,
                fontSize: `${calculatedNameFontSize}pt`,
              }}
              className={`text-3xl ${metadata.name.bold && "font-bold"}`}
            >
              {personalDetails.fullName}
            </h1>
            <p
              style={{ fontSize: `${calculatedJobTitleFontSize}pt` }}
              className={`text-lg ${metadata.jobTitle.jobTitleStyle === "italic" && "italic"}`}
            >
              {personalDetails.jobTitle}
            </p>
            <div className="flex justify-center flex-wrap gap-4 mt-2 text-sm">
              <span>{personalDetails.phone}</span>
              <span>{personalDetails.email}</span>
              <span>{personalDetails.location}</span>
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
        <div className="grid grid-cols-2 gap-6">
          {/* Left Column */}
          <div>
            {personalDetails && metadata.layout.headerPosition === "left" &&(
          <div className="text-center pb-4">
            <h1
              style={{
                fontFamily: metadata.name.creativeFontOption,
                fontSize: `${calculatedNameFontSize}pt`,
              }}
              className={`text-3xl ${metadata.name.bold && "font-bold"}`}
            >
              {personalDetails.fullName}
            </h1>
            <p
              style={{ fontSize: `${calculatedJobTitleFontSize}pt` }}
              className={`text-lg ${metadata.jobTitle.jobTitleStyle === "italic" && "italic"}`}
            >
              {personalDetails.jobTitle}
            </p>
            <div className="flex justify-center flex-wrap gap-4 mt-2 text-sm">
              <span>{personalDetails.phone}</span>
              <span>{personalDetails.email}</span>
              <span>{personalDetails.location}</span>
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
            {metadata.layout.twoRowSectionArrangement[0]?.map((sectionKey) =>
              renderSection(sectionKey)
            )}
          </div>

          {/* Right Column */}
          <div>
            {personalDetails && metadata.layout.headerPosition === "right" &&(
          <div className="text-center pb-4">
            <h1
              style={{
                fontFamily: metadata.name.creativeFontOption,
                fontSize: `${calculatedNameFontSize}pt`,
              }}
              className={`text-3xl ${metadata.name.bold && "font-bold"}`}
            >
              {personalDetails.fullName}
            </h1>
            <p
              style={{ fontSize: `${calculatedJobTitleFontSize}pt` }}
              className={`text-lg ${metadata.jobTitle.jobTitleStyle === "italic" && "italic"}`}
            >
              {personalDetails.jobTitle}
            </p>
            <div className="flex justify-center flex-wrap gap-4 mt-2 text-sm">
              <span>{personalDetails.phone}</span>
              <span>{personalDetails.email}</span>
              <span>{personalDetails.location}</span>
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
            {metadata.layout.twoRowSectionArrangement[1]?.map((sectionKey) =>
              renderSection(sectionKey)
            )}
          </div>
        </div>
      </>
    ) : (
      <>
      {personalDetails && (
              <div className="text-center pb-4">
                <h1
                  style={{
                    fontFamily: metadata.name.creativeFontOption,
                    fontSize: `${calculatedNameFontSize}pt`,
                  }}
                  className={`text-3xl ${metadata.name.bold && "font-bold"}`}
                >
                  {personalDetails.fullName}
                </h1>
                <p
                  style={{ fontSize: `${calculatedJobTitleFontSize}pt` }}
                  className={`text-lg ${metadata.jobTitle.jobTitleStyle === "italic" && "italic"}`}
                >
                  {personalDetails.jobTitle}
                </p>
                <div className="flex justify-center flex-wrap gap-4 mt-2 text-sm">
                  <span>{personalDetails.phone}</span>
                  <span>{personalDetails.email}</span>
                  <span>{personalDetails.location}</span>
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
        {metadata.layout.sectionArrangement?.map((sectionKey) =>
          renderSection(sectionKey)
        )}
      </>
    )}
  </div>
);

}

const Section = ({ title, style, fontSize, children}) => {

  const heading = style.capitalization === "capitalize" ? title.charAt(0).toUpperCase() + title.slice(1) : title.toUpperCase()
  
  const calculatedFontSize = calculateFontSize(fontSize ?? 10, style.size);

  return (
    <>
        {style.headingStyle === "underline" && (
            <section>
              <h2 style={{ fontSize: `${calculatedFontSize}pt` }} className="w-fit font-semibold border-b-2 border-[#000000] mb-2">{heading}</h2>
              <div style={{ fontSize: `${fontSize}pt` }}  className="space-y-2 ">{children}</div>
            </section>
        )
        }
        {style.headingStyle === "line" && (
            <section>
              <h2 style={{ fontSize: `${calculatedFontSize}pt` }}  className="text-xl font-semibold border-b-2 border-[#000000] mb-2">{heading}</h2>
              <div style={{ fontSize: `${fontSize}pt` }} className="space-y-2 ">{children}</div>
            </section>
        )
        }
        {style.headingStyle === "simple" && (
            <section>
              <h2 style={{ fontSize: `${calculatedFontSize}pt` }}  className="text-xl font-semibold mb-2">{heading}</h2>
              <div style={{ fontSize: `${fontSize}pt` }} className="space-y-2 ">{children}</div>
            </section>
        )
        }
        {style.headingStyle === "thickShortUnderline" && (
            <section>
                <h2 style={{ fontSize: `${calculatedFontSize}pt` }}  className="text-xl font-semibold">{heading}</h2>
                <div className="border-b-5 w-[40px]  border-[#000000] mb-2"></div>
                <div style={{ fontSize: `${fontSize}pt` }} className="space-y-2 ">{children}</div>
            </section>
        )
        }
        {style.headingStyle === "zigZagLine" && (
            <section>
                <h2 style={{ fontSize: `${calculatedFontSize}pt` }}  className="text-xl font-semibold mb-1">{heading}</h2>
                <div
                className="w-full h-[6px] mb-2"
                style={{
                    backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='6' viewBox='0 0 12 6'><path d='M0 6L3 0L6 6L9 0L12 6' stroke='black' stroke-width='1' fill='none'/></svg>")`,
                    backgroundRepeat: "repeat-x",
                    backgroundSize: "auto 100%",
                }}
                ></div>
                <div style={{ fontSize: `${fontSize}pt` }} className="space-y-2 ">{children}</div>
            </section>
        )}
        {style.headingStyle === "topBottomLine" && (
            <section>
                <div className="border-b-2 border-[#000000]"></div>
                <h2 style={{ fontSize: `${calculatedFontSize}pt` }}  className="text-xl font-semibold text-center">{heading}</h2>
                <div className="border-b-2 border-[#000000] mb-2"></div>
                <div style={{ fontSize: `${fontSize}pt` }} className="space-y-2 ">{children}</div>
            </section>
        )
        }
        {style.headingStyle === "box" && (
            <section>
                <div className="bg-[#000000]/7 print:bg-[#000000]/7 mb-2">
                <h2 style={{ fontSize: `${calculatedFontSize}pt` }}  className="text-xl font-semibold text-center bg">
                    {heading}
                </h2>
                </div>
                <div style={{ fontSize: `${fontSize}pt` }} className="space-y-2 ">{children}</div>
            </section>
        )
        }
    </>
)};

const calculateFontSize = (baseFontSize, sizeOption) => {
  const sizeOffset = {
    s: 1,
    m: 2,
    l: 3,
    xl: 4,
  };

  return baseFontSize + (sizeOffset[sizeOption] ?? 0); // fallback to 0 if invalid
};

const calculateNameFontSize = (baseFontSize, sizeOption) => {
  const sizeOffset = {
    XS: 0,
    S: 3,
    M: 6,
    L: 9,
    XL: 12,
  };

  return baseFontSize + 7.5 + (sizeOffset[sizeOption] ?? 0); // fallback to 0 if invalid
};

const calculateJobTitleFontSize = (baseFontSize, nameSizeOption, jobTitleSizeOption) => {
  // Map name size options to numerical offsets (same as in calculateNameFontSize logic)
  const nameSizeOffsetMap = {
    XS: 0,
    S: 3,
    M: 6,
    L: 9,
    XL: 12,
  };

  // Map job title size options to numerical indices for progression calculation
  const jobTitleSizeIndexMap = {
    S: 0,
    M: 1,
    L: 2,
  };

  // Get the numerical offset for the given name size option, defaulting to 0 for XS/unspecified
  const nameOffset = nameSizeOffsetMap[nameSizeOption] ?? 0;

  // This is the base font size against which the job title ratios are applied.
  // It's derived from the formula observed in the provided data points, which ties
  // the job title size to the name's effective base size (baseFontSize + 7.5 + nameOffset).
  const nameFontSizeBaseForRatio = baseFontSize + 7.5 + nameOffset;

  // Calculate the base factor for the 'S' jobTitleSize option.
  // This factor decreases as nameSize increases.
  // The initial factor for nameSize 'XS' (nameOffset 0) is 0.72.
  // For every increment in nameSize (which corresponds to a +3 step in nameOffset),
  // the baseFactorS decreases by 0.015.
  const baseFactorS = 0.72 - ((nameOffset / 3) * 0.015);

  // Get the numerical index for the given job title size option (S=0, M=1, L=2), defaulting to 0 for S/unspecified
  const jobTitleIndex = jobTitleSizeIndexMap[jobTitleSizeOption] ?? 0;

  // Calculate the final ratio for the specific jobTitleSize.
  // The ratios for S, M, L jobTitleSize options have a common difference of 0.08.
  const finalJobTitleRatio = baseFactorS + (jobTitleIndex * 0.08);

  // The final job title font size is the product of its derived ratio and the name's effective base size.
  const finalJobTitleFontSize = finalJobTitleRatio * nameFontSizeBaseForRatio;

  return finalJobTitleFontSize;
};


const Skills = ({ skills, style }) => {
  const levelMap = {
    BEGINNER: 1,
    AMATEUR: 2,
    COMPETENT: 3,
    PROFICIENT: 4,
    EXPERT: 5,
  };

  return (
    <>
      {style.layout === "grid" &&
        <div className={`grid ${style.layoutInfo}`}>
            {skills.rankedSkills.map((skill) => (
            // {skills.map((skill) => (
            <div key={skill._id} className="mb-2">
                <strong>{skill.name}</strong>
                <ul className="list-disc list-inside ml-4">
                {skill.subSkills.map((s, idx) => (
                    <li key={idx}>{s}</li>
                ))}
                </ul>
            </div>
            ))}
        </div>
      }
      {style.layout === "level" &&
        <div className="grid grid-cols-2">
            {skills.rankedSkills.map((skill) => {
            // {skills.map((skill) => {
            const level = levelMap[skill.level.toUpperCase()] || 0;
            return (  
            <div key={skill._id} className="mr-1">
              <div className="flex justify-between items-center">
                <strong>{skill.name} {style.layoutInfo === "text" && "— " + skill.level.toLowerCase()}</strong>
                {/* DOTS Layout */}
                {style.layoutInfo === "dots" && (
                  <div className="flex gap-1 ml-2">
                    {[...Array(5)].map((_, idx) => (
                      <span
                        key={idx}
                        className={`w-2 h-2 rounded-full ${
                          idx < level ? "bg-[#000000]" : "bg-[#d1d5dc]"
                        }`}
                      />
                    ))}
                  </div>
                )}

                {/* BAR Layout */}
                {style.layoutInfo === "bar" && (
                  <div className="w-24 h-2 bg-[#e5e7eb] ml-2 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#000000]"
                      style={{ width: `${(level / 5) * 100}%` }}
                    />
                  </div>
                )}
              </div>
                <ul className="list-disc list-inside ml-4">
                {skill.subSkills.map((s, idx) => (
                    <li key={idx}>{s}</li>
                ))}
                </ul>
            </div>
            )})}
        </div>
      }
      {style.layout === "compact" &&
        <div className={`${style.layoutInfo === "newline" ? "" : "flex flex-wrap"}`}>
            {skills.rankedSkills.map((skill, idx) => (
            // {skills.map((skill, idx) => (
            <>
              <div key={skill._id} className={`${style.layoutInfo !== "newline" ? "mr-2" : ""}`}>
                  <strong>{skill.name}{style.subInfoStyle === "dash" && " —"}{style.subInfoStyle === "colon" && " :"} </strong>
                  {style.subInfoStyle === "bracket" && "("}
                  {skill.subSkills.map((s, idx) => (
                    <span key={idx}>
                    {s}
                    {style.layoutInfo === "bullet" && idx !== skill.subSkills.length - 1 && " | "}
                    {style.layoutInfo === "newline" && idx !== skill.subSkills.length - 1 && " | "}
                    {style.layoutInfo === "comma" && idx !== skill.subSkills.length - 1 && " | "}
                    {style.layoutInfo === "pipe" && idx !== skill.subSkills.length - 1 && " • "}
                  </span>
                  ))}
                  {console.log(skill, idx)}
                  {style.subInfoStyle === "bracket" && ")"}
                  {style.layoutInfo === "pipe" && idx !== skills.length - 1 && " | "}
                  {style.layoutInfo === "comma" && idx !== skills.length - 1  && " , "}
                  {style.layoutInfo === "bullet" && idx !== skills.length - 1  && " • "}
              </div>
              {style.layoutInfo === "newline" && idx !== skills.length - 1 && <br />}
            </>
            ))}
        </div>
      }
      {style.layout === "bubble" &&
        <div className="flex flex-wrap">
            {skills.rankedSkills.map((skill) => (
            // {skills.map((skill) => (
            <div style={{ padding: "0.54em 0.8em 0.4em" }} key={skill._id} className="mr-2 border-1 rounded-sm border-[#000000]">
                <strong>{skill.name}{style.subInfoStyle === "dash" && " —"}{style.subInfoStyle === "colon" && " :"} </strong>
                {style.subInfoStyle === "bracket" && "("}
                {skill.subSkills.map((s, idx) => (
                  <span key={idx}>
                    {s}{idx !== skill.subSkills.length - 1 && " | "}
                  </span>
                ))}
                {style.subInfoStyle === "bracket" && ")"}
            </div>
            ))}
        </div>
      }
    </>
  )
}

const Languages = ({ languages, style }) => {
  const levelMap = {
    BASIC: 1,
    CONVERSATIONAL: 2,
    PROFICIENT: 3,
    FLUENT: 4,
    NATIVE: 5,
  };

  return (
    <>
      {style.layout === "grid" && (
        <div className={`grid ${style.layoutInfo}`}>
          {languages.map((lang) => (
            <div key={lang._id} className="mb-2">
              <strong>{lang.name}</strong>
              {lang.additionalInfo && <p>{lang.additionalInfo}</p>}
            </div>
          ))}
        </div>
      )}

      {style.layout === "level" && (
        <div className="grid grid-cols-2">
          {languages.map((lang) => {
            const level = levelMap[lang.level.toUpperCase()] || 0;
            return (
              <div key={lang._id} className="mr-1 mb-2">
                <div className="flex justify-between items-center">
                  <strong>
                    {lang.name}{" "}
                    {style.layoutInfo === "text" && "— " + lang.level.toLowerCase()}
                  </strong>

                  {style.layoutInfo === "dots" && (
                    <div className="flex gap-1 ml-2">
                      {[...Array(5)].map((_, idx) => (
                        <span
                          key={idx}
                          className={`w-2 h-2 rounded-full ${
                            idx < level ? "bg-[#000000]" : "bg-[#d1d5dc]"
                          }`}
                        />
                      ))}
                    </div>
                  )}

                  {style.layoutInfo === "bar" && (
                    <div className="w-24 h-2 bg-[#e5e7eb] ml-2 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#000000]"
                        style={{ width: `${(level / 5) * 100}%` }}
                      />
                    </div>
                  )}
                </div>
                {lang.additionalInfo && <p>{lang.additionalInfo}</p>}
              </div>
            );
          })}
        </div>
      )}

      {style.layout === "compact" && (
        <div className={`${style.layoutInfo === "newline" ? "" : "flex flex-wrap"}`}>
          {languages.map((lang, idx) => (
            <>
              <div key={lang._id} className={`${style.layoutInfo !== "newline" ? "mr-2" : ""}`}>
                <strong>
                  {lang.name}
                  {style.subInfoStyle === "dash" && " —"}
                  {style.subInfoStyle === "colon" && " :"}{" "}
                </strong>
                {style.subInfoStyle === "bracket" && "("}
                <span>
                  {lang.additionalInfo && ` ${lang.additionalInfo}`}
                </span>
                {style.subInfoStyle === "bracket" && ")"}
                {style.layoutInfo === "pipe" && idx !== languages.length - 1 && " | "}
                {style.layoutInfo === "comma" && idx !== languages.length - 1 && " , "}
                {style.layoutInfo === "bullet" && idx !== languages.length - 1 && " • "}
              </div>
              {style.layoutInfo === "newline" && idx !== languages.length - 1 && <br />}
            </>
          ))}
        </div>
      )}

      {style.layout === "bubble" && (
        <div className="flex flex-wrap">
          {languages.map((lang) => (
            <div
              key={lang._id}
              style={{ padding: "0.54em 0.8em 0.4em" }}
              className="mr-2 border-1 rounded-sm border-[#000000]"
            >
              <strong>
                {lang.name}
                {style.subInfoStyle === "dash" && " —"}
                {style.subInfoStyle === "colon" && " :"}{" "}
              </strong>
              {style.subInfoStyle === "bracket" && "("}
              <span>
                {lang.additionalInfo && ` ${lang.additionalInfo}`}
              </span>
              {style.subInfoStyle === "bracket" && ")"}
            </div>
          ))}
        </div>
      )}
    </>
  );
};

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
              className="underline flex items-center gap-1 "
            >
              <LinkIcon size={10}/>
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
              className="underline flex items-center gap-1 "
            >
              <LinkIcon size={10}/>
            </a>
          )}

        </div>
        {issuer && <p className="italic ">{issuer}</p>}
      </div>
      {date && <div className=" text-right whitespace-nowrap">{date}</div>}
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
              className="underline flex items-center gap-1 "
            >
              <LinkIcon size={10}/>
            </a>
          )}

        </div>
        {publisher && <p className="italic ">{publisher}</p>}
      </div>
      {date && <div className=" text-right whitespace-nowrap">{date}</div>}
    </div>
    {description && <p className=" text-[#364153]">{description}</p>}
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
              className="underline flex items-center gap-1 "
            >
              <LinkIcon size={10}/>
            </a>
          )}

        </div>
        {issuer && <p className="italic ">{issuer}</p>}
      </div>
      {date && <div className=" text-right whitespace-nowrap">{date}</div>}
    </div>
    {description && <p className=" text-[#364153]">{description}</p>}
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
              className="underline flex items-center gap-1 "
            >
              <LinkIcon size={10}/>
            </a>
          )}

        </div>
      </div>
      <div className=" text-right whitespace-nowrap">
        {(date || location) && (
          <div>
            {date}
            {location && ` | ${location}`}
          </div>
        )}
      </div>
    </div>
    {description && <p className=" text-[#364153]">{description}</p>}
  </div>
);

const Certificates = ({ certificates, style }) => {
  return (
    <>
      {style.layout === "grid" && (
        <div className={`grid ${style.layoutInfo}`}>
          {certificates.map((cert) => (
            <div key={cert._id} className="mb-2">
              <strong>{cert.title}</strong>
              {cert.additionalInfo && <p className="italic">{cert.additionalInfo}</p>}
            </div>
          ))}
        </div>
      )}

      {style.layout === "compact" && (
        <div className={`${style.layoutInfo === "newline" ? "" : "flex flex-wrap"}`}>
          {certificates.map((cert, idx) => (
            <>
              <div
                key={cert._id}
                className={`${style.layoutInfo !== "newline" ? "mr-2" : ""}`}
              >
                <strong>
                  {cert.title}
                  {style.subInfoStyle === "dash" && cert.additionalInfo && " —"}
                  {style.subInfoStyle === "colon" && cert.additionalInfo && " :"}{" "}
                </strong>
                {style.subInfoStyle === "bracket" && cert.additionalInfo && "("}
                {cert.additionalInfo && <span className="italic">{cert.additionalInfo}</span>}
                {style.subInfoStyle === "bracket" && cert.additionalInfo && ")"}

                {style.layoutInfo === "pipe" && idx !== certificates.length - 1 && " | "}
                {style.layoutInfo === "comma" && idx !== certificates.length - 1 && ", "}
                {style.layoutInfo === "bullet" && idx !== certificates.length - 1 && " • "}
              </div>
              {style.layoutInfo === "newline" && idx !== certificates.length - 1 && <br />}
            </>
          ))}
        </div>
      )}

      {style.layout === "bubble" && (
        <div className="flex flex-wrap">
          {certificates.map((cert) => (
            <div
              key={cert._id}
              style={{ padding: "0.54em 0.8em 0.4em" }}
              className="mr-2 border-1 rounded-sm border-[#000000]"
            >
              <strong>
                {cert.title}
                {style.subInfoStyle === "dash" && cert.additionalInfo && " —"}
                {style.subInfoStyle === "colon" && cert.additionalInfo && " :"}{" "}
              </strong>
              {style.subInfoStyle === "bracket" && cert.additionalInfo && "("}
              {cert.additionalInfo && <span className="italic">{cert.additionalInfo}</span>}
              {style.subInfoStyle === "bracket" && cert.additionalInfo && ")"}
            </div>
          ))}
        </div>
      )}
    </>
  );
};



const Education = ({ title, subtitle, location, grade, date, description, style }) => (
  <div>
    <div className="flex justify-between">
      <div>
        {style.titleSubtitleOrder === "degree-school" &&
          <>
            <strong>{title}</strong>
            {subtitle && <p>{subtitle}</p>}
          </>
        }
        {style.titleSubtitleOrder === "school-degree" &&
          <>
            {subtitle && <p>{subtitle}</p>}
            <strong>{title}</strong>
          </>
        }
      </div>
      <div className=" text-right whitespace-nowrap">
        {grade && <div>{grade}</div>}
        {(date || location) && (
          <div>
            {date}
            {location && ` | ${location}`}
          </div>
        )}
      </div>
    </div>
    {description && <p className=" text-[#364153]">{description}</p>}
  </div>
);

const ProfessionalExp = ({ title, subtitle, location, date, description, style }) => (
  <div>
    <div className="flex justify-between">
      <div>
        {style.titleSubtitleOrder === "employer-JobTitle" &&
          <>
            <strong>{title}</strong>
            {subtitle && <p>{subtitle}</p>}
          </>
        }
        {style.titleSubtitleOrder === "jobTitle-Employer" &&
          <>
            {subtitle && <p>{subtitle}</p>}
            <strong>{title}</strong>
          </>
        }
      </div>
      <div className=" text-right whitespace-nowrap">
        {(date || location) && (
          <div>
            {date}
            {location && ` | ${location}`}
          </div>
        )}
      </div>
    </div>
    {description && <p className=" text-[#364153]">{description}</p>}
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
              <div>  
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
          {subtitle && <p className="italic ">{subtitle}</p>}
        </div>

        <div className=" text-right whitespace-nowrap">
          {formatDate(startDate)} - {formatDate(endDate)}
        </div>
      </div>

      {description && 
      <div className="list-disc list-inside">
        {parse(description)}
      </div>}
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