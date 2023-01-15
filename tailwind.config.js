module.exports = {
  darkMode: "class",
  content: [
    "./screens/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      green1: "#6B9080",
      green1hover: "#557969",
      green2: "#A4C3B2",
      green3: "#CCE3DE",
      green4: "#EAF4F4",
      green5: "#F6FFF8",
      textColor: "#333",
      borderColor: "#666",
      errorMsg: "red",
    },
    extend: {},
  },
  plugins: [],
  corePlugins: require("tailwind-rn/unsupported-core-plugins"),
}
