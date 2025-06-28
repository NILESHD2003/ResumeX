import React from "react";

const Section = ({ title, type, children }) => (
    <>
        {type === "underline" && (
            <section className="mt-6">
              <h2 className="text-xl w-fit font-semibold border-b-2 border-black mb-2">{title}</h2>
              <div className="space-y-2 text-sm">{children}</div>
            </section>
        )
        }
        {type === "line" && (
            <section className="mt-6">
              <h2 className="text-xl font-semibold border-b-2 border-black mb-2">{title}</h2>
              <div className="space-y-2 text-sm">{children}</div>
            </section>
        )
        }
        {type === "simple" && (
            <section className="mt-6">
              <h2 className="text-xl font-semibold mb-2">{title}</h2>
              <div className="space-y-2 text-sm">{children}</div>
            </section>
        )
        }
        {type === "thickShortUnderline" && (
            <section className="mt-6">
                <h2 className="text-xlfont-semibold">{title}</h2>
                <div className="border-b-5 w-[40px]  border-black mb-2"></div>
                <div className="space-y-2 text-sm">{children}</div>
            </section>
        )
        }
        {type === "zigZagLine" && (
            <section className="mt-6">
                <h2 className="text-xl font-semibold mb-1">{title}</h2>
                <div
                className="w-full h-[6px] mb-2"
                style={{
                    backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='6' viewBox='0 0 12 6'><path d='M0 6L3 0L6 6L9 0L12 6' stroke='black' stroke-width='1' fill='none'/></svg>")`,
                    backgroundRepeat: "repeat-x",
                    backgroundSize: "auto 100%",
                }}
                ></div>
                <div className="space-y-2 text-sm">{children}</div>
            </section>
        )}
        {type === "topBottomLine" && (
            <section className="mt-6">
                <div className="border-b-2 border-black"></div>
                <h2 className="text-xlfont-semibold text-center">{title}</h2>
                <div className="border-b-2 border-black mb-2"></div>
                <div className="space-y-2 text-sm">{children}</div>
            </section>
        )
        }
        {type === "box" && (
            <section className="mt-6">
                <div className="bg-[#000000]/7 mb-2">
                <h2 className="text-xl font-semibold text-center bg">
                    {title}
                </h2>
                </div>
                <div className="space-y-2 text-sm">{children}</div>
            </section>
        )
        }
    </>
);

export default Section; 