import React, { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "../API/pistonApi";
import langMap from "lang-map";
import toast from "react-hot-toast";

const RunCodeContext = createContext(null);

export const useRunCode = () => {
    const ctx = useContext(RunCodeContext);
    if (!ctx) throw new Error("useRunCode must be used inside a RunCodeContextProvider");
    return ctx;
};

export const RunCodeContextProvider = ({ children }) => {
    const [input, setInput] = useState("");      // stdin
    const [output, setOutput] = useState("");    // stdout / stderr
    const [isRunning, setIsRunning] = useState(false);

    const [supportedLanguages, setSupportedLanguages] = useState([]);
    const [selectedLanguage, setSelectedLanguage] = useState(null);


    // ------------------------------------------------------------
    // Load Piston Runtimes
    // ------------------------------------------------------------
    useEffect(() => {
        const load = async () => {
            try {
                const res = await axiosInstance.get("/runtimes");
                setSupportedLanguages(res.data);
            } catch (err) {
                toast.error("Failed to load runtimes");
                console.error(err);
            }
        };
        load();
    }, []);


    // ------------------------------------------------------------
    // Detect language from file extension
    // ------------------------------------------------------------
    const detectLanguage = (fileName) => {
        if (!fileName || supportedLanguages.length === 0) return null;

        const ext = fileName.split(".").pop();
        if (!ext) return null;

        const mapped = langMap.languages(ext)?.[0]?.toLowerCase();

        return (
            supportedLanguages.find(
                (l) =>
                    l.aliases.includes(ext) ||
                    l.language.toLowerCase() === mapped
            ) || null
        );
    };


    // ------------------------------------------------------------
    // Run Code File on Piston API  ⭐ FIXED (returns output)
    // ------------------------------------------------------------
    const runCode = async ({ fileName, content }) => {
        const lang = detectLanguage(fileName);

        if (!lang) {
            toast.error("Unknown or unsupported file type");
            return "";
        }

        setSelectedLanguage(lang);
        setIsRunning(true);
        toast.loading("Running code...");

        try {
            const res = await axiosInstance.post("/execute", {
                language: lang.language,
                version: lang.version,
                stdin: input,
                files: [
                    {
                        name: fileName,
                        content: content,
                    },
                ],
            });

            const result = res.data.run;
            const out = result.stderr || result.stdout || "";

            setOutput(out);  // update state
            return out;      // ⭐ return output so UI can use it instantly

        } catch (err) {
            console.error("Execution error:", err);
            setOutput("Execution failed.");
            toast.error("Error running code");
            return "Execution failed.";  // ⭐ return error directly
        } finally {
            toast.dismiss();
            setIsRunning(false);
        }
    };


    // ------------------------------------------------------------
    // What we provide to EditorPage
    // ------------------------------------------------------------
    const value = {
        input,
        setInput,

        output,
        isRunning,

        supportedLanguages,

        selectedLanguage,
        setSelectedLanguage,

        runCode,
    };

    return (
        <RunCodeContext.Provider value={value}>
            {children}
        </RunCodeContext.Provider>
    );
};

