
const DealClosedAlert = ({data, className}) => {
  return (
    <>
    <div className={`deal-closed-animation flex justify-center ${className}`}>
      <div className="wrapper w-max">
        <svg className="Banner4" height="160" width="670">
          <polygon
            className="BannerBorderEx4 BorderAnimationEx4"
            points="50 20, 30 130, 420 125, 440 40"
            style={{
              opacity: 1,
              fill: "NONE",
              stroke: "#da1f26",
              strokeWidth: 4.5,
            }}
          />
          <polygon
            className="BannerHolderEx4"
            points="25 31, 10 125, 410 135, 430 40"
            style={{ opacity: 0.1, fill: "#da1f26" }}
          />
          <polygon
            className="BannerHolderEx4"
            points="30 31, 15 120, 610 130, 630 20"
            style={{ opacity: 1, fill: "black" }}
          />

          <image
            href={data?.closedByPic || "https://static.vecteezy.com/system/resources/previews/019/896/008/original/male-user-avatar-icon-in-flat-design-style-person-signs-illustration-png.png"}
            x={38.5}
            y={0}
            width={55}
            height={55}
            clipPath="url(#circleMask)"
          />

          <defs>
            <clipPath id="circleMask">
              <circle cx="65.5" cy="27.5" r="27.5"></circle>
            </clipPath>
          </defs>

          <circle
            cx="65.5"
            cy="30.5"
            r="29.5"
            fill="none"
            stroke="white"
            stroke-width="2"
          />

          <polygon
            className="triangle1Ex4"
            style={{ opacity: 1, fill: "#da1f26" }}
            points="63.5,10.06217782649107 53,10 63.49999999999999,3.937822173508927"
          ></polygon>
          <polygon
            className="triangle2Ex4"
            points="130,15.196152422706632 114,10 123,4.803847577293366"
          ></polygon>
          <polygon
            className="triangle3Ex4"
            style={{ opacity: 1, fill: "black" }}
            points="33,20.196152422706632 29,15 37.99999999999999,9.803847577293366"
          ></polygon>
          <text
            className="SaleEx4 amount-animation"
            fontFamily="Josefin Sans"
            fontWeight="700"
            fontSize="70"
          >
            <tspan opacity="0.4" fill="white" x="300" y="104">
              {data?.amount}
            </tspan>
            <tspan fill="#fff" x="304" y="100">
              <tspan>{data?.amount}</tspan>
              <tspan fill="#fff" fontFamily="monospace" fontSize={"16"}>
                AED
              </tspan>
            </tspan>
          </text>
          <text
            className="BestEx4"
            fontFamily="Josefin Sans"
            fontWeight="300i"
            fontSize="25"
          >
            <tspan opacity="1" fill="#FFF" x="53" y="87">
              D E A L
            </tspan>
            <tspan fill="#fff" x="53" y="110">
              C L O S E D
            </tspan>
          </text>
        </svg>
      </div>
    </div>
    </>
  );
};

export default DealClosedAlert;
