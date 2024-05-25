import { createTheme } from "@mui/material";

const darkTheme = createTheme({
    palette: {
      mode: "dark",
      primary: {
        // Purple and green play nicely together.
        main: "#0099BD", //#17BEBB
      },
      secondary: {
        // This is green.A700 as hex.
        main: "#FFFFFF", //#F6C453
      },
    //   background: {
    //     default: "#000000",
    //   },
    },
    typography: {
      fontFamily: ["Lato", "Nunito Sans"].join(","),
    },
  });

export {
    darkTheme
}