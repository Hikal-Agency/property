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
        padding: "5px 10px",
    }),
    menuList: provided => ({
        ...provided,
        "&::-webkit-scrollbar": {
            width: "2px !important",
        },
        scrollbarWidth: "2px",
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
        padding: "5px 10px",
    }),
    menuList: provided => ({
        ...provided,
        "&::-webkit-scrollbar": {
            width: "2px !important",
        },
        scrollbarWidth: "2px",
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

// DATAGRID  
export const renderStyles = (currentMode, primaryColor) => ({
    control: provided => ({
        ...provided,
        background: "transparent",
        // borderColor: "#AAAAAA",
        borderColor: "transparent",
        color: currentMode === "dark" ? "#FFFFFF" : "#000000",
        minHeight: "34px",
        height: "34px",
        textAlign: "left", 
    }),
    valueContainer: (provided) => ({
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
            width: "2px !important",
        },
        scrollbarWidth: "2px",
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
        "&:hover": {
            background: primaryColor,
            color: "#FFFFFF",
        }
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