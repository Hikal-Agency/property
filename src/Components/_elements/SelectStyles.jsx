// SELECT WITHOUT BG 
export const selectStyles = (currentMode, primaryColor) => ({
    control: provided => ({
        ...provided,
        background: "transparent",
        borderColor: currentMode === "dark" ? "#EEEEEE" : "#666666",
        color: currentMode === "dark" ? "#FFFFFF" : "#000000",
        height: "34x",
        minHeight: "34px",
        marginBottom: "20px !important",
    }),
    placeholder: provided => ({
        ...provided,
        color: currentMode === "dark" ? "#EEEEEE" : "#333333",
    }),
    input: provided => ({
        ...provided,
        color: currentMode === "dark" ? "#EEEEEE" : "#333333",
    }),
    singleValue: provided => ({
        ...provided,
        color: currentMode === "dark" ? "#EEEEEE" : "#333333",
    }),
    menuPortal: base => ({
        ...base,
        zIndex: 9999,
    }),
    menu: (provided, state) => {
        const hasBgcolor = state.selectProps.options.some(
            option => option.bgColor
        );
        return {
            ...provided,
            filter:
                currentMode === "dark"
                ? "drop-shadow(1px 1px 6px rgb(238 238 238 / 0.3))"
                : "drop-shadow(1px 1px 6px rgb(28 28 28 / 0.3))",
            background: hasBgcolor 
                ? (currentMode === "dark" ? "#000000" : "#FFFFFF") 
                : (currentMode === "dark"
                    ? "rgb(28 28 28 / 0.9)"
                    : "rgb(238 238 238 / 0.9)"),
            color: currentMode === "dark" ? "#EEEEEE" : "#333333",
            borderRadius: "10px",
            padding: "5px 10px",
        };
    },
    menuList: provided => ({
        ...provided,
        "&::-webkit-scrollbar": {
            width: "2px !important",
        },
        scrollbarWidth: "2px",
    }),
    option: (provided, state) => ({
        ...provided,
        background: state?.data?.bgColor ? (state?.data?.bgColor) : (state.isSelected ? primaryColor : (currentMode === "dark" ? "#000000" : "#FFFFFF")),
        color: state?.data?.color ? (state?.data?.color) : (state.isSelected ? "#FFFFFF" : (currentMode === "dark" ? "#EEEEEE" : "#333333")),
        padding: "5px 10px",
        borderRadius: "5px",
        marginTop: "5px",
        marginBottom: "5px",
        wordWrap: "break-word",
        fontSize: "11px",
        "&:hover": {
            background: !state?.data?.bgColor && primaryColor,
            color: !state?.data?.bgColor && "#FFFFFF",
        }
    }),
    indicatorsContainer: (provided) => ({
        ...provided,
        height: "auto",
        width: "30px",
        "& svg": {
            height: "12px",
            width: "12px",
            color: currentMode === "dark" ? "#EEEEEE" : "#666666",
        }
    }),
    indicatorSeparator: (provided) => ({
        ...provided,
        display: 'none',
    }),
});

// SELECT WITH BG 
export const selectBgStyles = (currentMode, primaryColor, blurDarkColor, blurLightColor) => ({
    control: provided => ({
        ...provided,
        background: currentMode === "dark" ? blurDarkColor : blurLightColor,
        borderColor: "#AAAAAA",
        color: currentMode === "dark" ? "#FFFFFF" : "#000000",
        height: "34x",
        minHeight: "34px",
        textAlign: "left", 
    }),
    placeholder: provided => ({
        ...provided,
        color: currentMode === "dark" ? "#EEEEEE" : "#333333",
    }),
    input: provided => ({
        ...provided,
        color: currentMode === "dark" ? "#EEEEEE" : "#333333",
    }),
    singleValue: provided => ({
        ...provided,
        color: currentMode === "dark" ? "#EEEEEE" : "#333333",
    }),
    menuPortal: base => ({
        ...base,
        zIndex: 9999,
    }),
    menu: (provided, state) => {
        const hasBgcolor = state.selectProps.options.some(
            option => option.bgColor
        );
        return {
            ...provided,
            filter:
                currentMode === "dark"
                ? "drop-shadow(1px 1px 6px rgb(238 238 238 / 0.3))"
                : "drop-shadow(1px 1px 6px rgb(28 28 28 / 0.3))",
            background: hasBgcolor 
                ? (currentMode === "dark" ? "#000000" : "#FFFFFF") 
                : (currentMode === "dark"
                    ? "rgb(28 28 28 / 0.9)"
                    : "rgb(238 238 238 / 0.9)"),
            color: currentMode === "dark" ? "#EEEEEE" : "#333333",
            borderRadius: "10px",
            padding: "5px 10px",
        };
    },
    menuList: provided => ({
        ...provided,
        "&::-webkit-scrollbar": {
            width: "2px !important",
        },
        scrollbarWidth: "2px",
    }),
    option: (provided, state) => ({
        ...provided,
        background: state?.data?.bgColor ? (state?.data?.bgColor) : (state.isSelected ? primaryColor : (currentMode === "dark" ? "#000000" : "#FFFFFF")),
        color: state?.data?.color ? (state?.data?.color) : (state.isSelected ? "#FFFFFF" : (currentMode === "dark" ? "#EEEEEE" : "#333333")),
        padding: "5px 10px",
        borderRadius: "5px",
        marginTop: "5px",
        marginBottom: "5px",
        wordWrap: "break-word",
        fontSize: "11px",
        "&:hover": {
            background: !state?.data?.bgColor && primaryColor,
            color: !state?.data?.bgColor && "#FFFFFF",
        },
    }),
    indicatorsContainer: (provided) => ({
        ...provided,
        height: "auto",
        width: "30px",
        "& svg": {
            height: "12px",
            width: "12px",
            color: currentMode === "dark" ? "#EEEEEE" : "#666666",
        }
    }),
    indicatorSeparator: (provided) => ({
        ...provided,
        display: 'none',
    }),
});

// PAGINATION 
export const pageStyles = (currentMode, primaryColor) => ({
    control: provided => ({
        ...provided,
        background: "transparent",
        borderColor: currentMode === "dark" ? "#EEEEEE" : "#666666",
        color: currentMode === "dark" ? "#FFFFFF" : "#000000",
        height: "34x",
        minHeight: "34px",
    }),
    placeholder: provided => ({
        ...provided,
        color: currentMode === "dark" ? "#EEEEEE" : "#333333",
    }),
    input: provided => ({
        ...provided,
        color: currentMode === "dark" ? "#EEEEEE" : "#333333",
    }),
    singleValue: provided => ({
        ...provided,
        color: currentMode === "dark" ? "#EEEEEE" : "#333333",
    }),
    menuPortal: base => ({
        ...base,
        zIndex: 9999,
    }),
    menu: provided => ({
        ...provided,
        filter:
            currentMode === "dark"
            ? "drop-shadow(1px 1px 6px rgb(238 238 238 / 0.3))"
            : "drop-shadow(1px 1px 6px rgb(28 28 28 / 0.3))",
        background:
            currentMode === "dark"
                ? "rgb(28 28 28 / 0.9)"
                : "rgb(238 238 238 / 0.9)",
        color: currentMode === "dark" ? "#EEEEEE" : "#333333",
        borderRadius: "10px",
        padding: "1px 6px",
        zIndex: 100,
    }),
    menuList: provided => ({
        ...provided,
        "&::-webkit-scrollbar": {
            width: "0 !important",
        },
        scrollbarWidth: "none",
        width: "auto"
    }),
    option: (provided, state) => ({
        ...provided,
        background: state.isSelected ? primaryColor : (currentMode === "dark" ? "#000000" : "#FFFFFF"),
        color: state.isSelected ? "#FFFFFF" : (currentMode === "dark" ? "#EEEEEE" : "#333333"),
        padding: "5px 10px",
        borderRadius: "5px",
        marginTop: "5px",
        marginBottom: "5px",
        wordWrap: "break-word",
        fontSize: "11px",
        "&:hover": {
            background: primaryColor,
            color: "#FFFFFF",
        }
    }),
    indicatorsContainer: (provided) => ({
        ...provided,
        height: "auto",
        width: "30px",
        "& svg": {
            height: "12px",
            width: "12px",
            color: currentMode === "dark" ? "#EEEEEE" : "#666666",
        }
    }),
    indicatorSeparator: (provided) => ({
        ...provided,
        display: 'none',
    }),
});

// DATAGRID (FEEDBACK STATUS ROUNDED)
export const renderStyles = (currentMode, primaryColor) => ({
    control: (provided, state) => {
        const selectedOption = state?.selectProps?.options.find(
            option => option.value === state?.selectProps?.value?.value
        );
        const hasBgColor = selectedOption?.bgColor;
        return {
            ...provided,
            background: "transparent",
            // borderColor: "#AAAAAA",
            borderColor: "transparent",
            color: currentMode === "dark" ? "#FFFFFF" : "#000000",
            minHeight: "34px",
            height: "34px",
            textAlign: "left", 
        };
    },
    valueContainer: (provided, state) => {
        const selectedOption = state?.selectProps?.options.find(
            option => option.value === state?.selectProps?.value?.value
        );
        const hasBgColor = selectedOption?.bgColor;
        const circleColor = selectedOption?.bgColor;
        return {
            ...provided,
            // border: '1px solid #AAAAAA',
            // borderRadius: '5px',
            padding: hasBgColor ? "1px 0px 1px 15px" : "1px 0px 1px 2px",
            "&::before": {
                content: '""',
                display: "block",
                position: "absolute",
                left: 0,
                top: "50%",
                transform: "translateY(-50%)",
                width: "12px",
                height: "12px",
                backgroundColor: hasBgColor && circleColor,
                border: hasBgColor && (currentMode === "dark" ? "1px solid #777777" : "1px solid #CCCCCC"),
                borderRadius: "50%",
            }
        };
    },
    placeholder: provided => ({
        ...provided,
        color: currentMode === "dark" ? "#EEEEEE" : "#333333",
    }),
    input: provided => ({
        ...provided,
        color: currentMode === "dark" ? "#EEEEEE" : "#333333",
    }),
    singleValue: provided => ({
        ...provided,
        color: currentMode === "dark" ? "#EEEEEE" : "#333333",
        
    }),
    menuPortal: base => ({
        ...base,
        zIndex: 9999,
    }),
    menu: (provided, state) => {
        const hasBgcolor = state.selectProps.options.some(
            option => option.bgColor
        );
        return {
            ...provided,
            filter:
                currentMode === "dark"
                ? "drop-shadow(1px 1px 6px rgb(238 238 238 / 0.3))"
                : "drop-shadow(1px 1px 6px rgb(28 28 28 / 0.3))",
            background: hasBgcolor 
                ? (currentMode === "dark" ? "#000000" : "#FFFFFF") 
                : (currentMode === "dark"
                    ? "rgb(28 28 28 / 0.9)"
                    : "rgb(238 238 238 / 0.9)"),
            color: currentMode === "dark" ? "#EEEEEE" : "#333333",
            borderRadius: "10px",
            padding: "1px 6px",
            zIndex: 100,
        };
    },
    menuList: provided => ({
        ...provided,
        "&::-webkit-scrollbar": {
            width: "2px !important",
        },
        scrollbarWidth: "2px",
    }),
    option: (provided, state) => ({
        ...provided,
        background: state?.data?.bgColor ? (state?.data?.bgColor) : (state.isSelected ? primaryColor : (currentMode === "dark" ? "#000000" : "#FFFFFF")),
        color: state?.data?.color ? (state?.data?.color) : (state.isSelected ? "#FFFFFF" : (currentMode === "dark" ? "#EEEEEE" : "#333333")),
        padding: "5px 10px",
        borderRadius: "5px",
        marginTop: "5px",
        marginBottom: "5px",
        wordWrap: "break-word",
        fontSize: "11px",
        // border: state?.data?.bgColor && "1px solid #AAAAAA",
        "&:hover": {
            background: !state?.data?.bgColor && primaryColor,
            color: !state?.data?.bgColor && "#FFFFFF",
        },
    }),
    indicatorsContainer: (provided) => ({
        ...provided,
        height: "auto",
        width: "22px",
        "& svg": {
            height: "12px",
            width: "12px",
            color: "#AAAAAA",
        }
    }),
    indicatorSeparator: (provided) => ({
        ...provided,
        display: 'none',
    }),
});

// DATAGRID (FEEDBACK STATUS BACKGROUND)
export const renderStyles2 = (currentMode, primaryColor) => ({
    control: (provided, state) => {
        const selectedOption = state?.selectProps?.options.find(
            option => option.value === state?.selectProps?.value?.value
        );
        const hasBgColor = selectedOption?.bgColor;
        return {
            ...provided,
            background: hasBgColor ? selectedOption.bgColor : "transparent",
            // borderColor: "#AAAAAA",
            borderColor: "transparent",
            color: currentMode === "dark" ? "#FFFFFF" : "#000000",
            minHeight: "34px",
            height: "34px",
            textAlign: "left", 
        };
    },
    valueContainer: provided => ({
        ...provided,
        // border: '1px solid #AAAAAA',
        // borderRadius: '5px',
        padding: "1px 0px 1px 2px",
    }),
    placeholder: provided => ({
        ...provided,
        color: currentMode === "dark" ? "#EEEEEE" : "#333333",
    }),
    input: provided => ({
        ...provided,
        color: currentMode === "dark" ? "#EEEEEE" : "#333333",
    }),
    singleValue: (provided, state) => {
        const selectedOption = state?.selectProps?.options.find(
            option => option.value === state?.selectProps?.value?.value
        );
        const hasBgColor = selectedOption?.bgColor;
        return {
            ...provided,
            color: hasBgColor ? selectedOption.color : (currentMode === "dark" ? "#EEEEEE" : "#333333"),
            // fontWeight: hasBgColor && "bold",
        };
    },
    menuPortal: base => ({
        ...base,
        zIndex: 9999,
    }),
    menu: (provided, state) => {
        const hasBgcolor = state.selectProps.options.some(
            option => option.bgColor
        );
        return {
            ...provided,
            filter:
                currentMode === "dark"
                ? "drop-shadow(1px 1px 6px rgb(238 238 238 / 0.3))"
                : "drop-shadow(1px 1px 6px rgb(28 28 28 / 0.3))",
            background: hasBgcolor 
                ? (currentMode === "dark" ? "#000000" : "#FFFFFF") 
                : (currentMode === "dark"
                    ? "rgb(28 28 28 / 0.9)"
                    : "rgb(238 238 238 / 0.9)"),
            color: currentMode === "dark" ? "#EEEEEE" : "#333333",
            borderRadius: "10px",
            padding: "1px 6px",
            zIndex: 100,
        };
    },
    menuList: provided => ({
        ...provided,
        "&::-webkit-scrollbar": {
            width: "2px !important",
        },
        scrollbarWidth: "2px",
    }),
    option: (provided, state) => ({
        ...provided,
        background: state?.data?.bgColor ? (state?.data?.bgColor) : (state.isSelected ? primaryColor : (currentMode === "dark" ? "#000000" : "#FFFFFF")),
        color: state?.data?.color ? (state?.data?.color) : (state.isSelected ? "#FFFFFF" : (currentMode === "dark" ? "#EEEEEE" : "#333333")),
        padding: "5px 10px",
        borderRadius: "5px",
        marginTop: "5px",
        marginBottom: "5px",
        wordWrap: "break-word",
        fontSize: "11px",
        // border: state?.data?.bgColor && "1px solid #AAAAAA",
        "&:hover": {
            background: !state?.data?.bgColor && primaryColor,
            color: !state?.data?.bgColor && "#FFFFFF",
        },
    }),
    indicatorsContainer: (provided) => ({
        ...provided,
        height: "auto",
        width: "22px",
        "& svg": {
            height: "12px",
            width: "12px",
            color: "#AAAAAA",
        }
    }),
    indicatorSeparator: (provided) => ({
        ...provided,
        display: 'none',
    }),
});