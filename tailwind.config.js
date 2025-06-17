/** @type {import('tailwindcss').Config} */
export default {
    important: true,
    content: ["./src/**/*.{css,js,vue}"],
    theme: {
        extend: {
            backgroundImage: {
                theme: "linear-gradient(90deg, #3c57b6 0%, #948cce 90%)",
            },
            borderColor: {
                theme: "#3c57b6",
            },
            textColor: {
                theme: "#3c57b6",
            },
        },
    },
    plugins: [],
};
