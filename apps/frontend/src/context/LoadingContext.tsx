import { createContext, useContext, useState,type ReactNode } from "react";
import { ClipLoader } from "react-spinners";

interface LoadingContextType {
    loading: boolean;
    setLoading: (loading: boolean, text?: string) => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function LoadingProvider({ children }: { children: ReactNode }) {
    const [loading, setLoadingState] = useState(false);

    const setLoading = (status: boolean) => {
        setLoadingState(status);
    };

    return (
        <LoadingContext.Provider value={{ loading, setLoading }}>
            {children}
            {loading && (
                <div style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100vw",
                    height: "100vh",
                    backgroundColor: "rgba(0, 0, 0, 0.4)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "12px",
                    zIndex: 9999,
                    backdropFilter: "blur(2px)",
                    pointerEvents: "all"
                }}>
                    <ClipLoader color="#ffffff" size={60}   speedMultiplier={0.9} />
                </div>
            )}
        </LoadingContext.Provider>
    );
}

export function useLoading() {
    const context = useContext(LoadingContext);
    if (!context) {
        throw new Error("useLoading must be used within a LoadingProvider");
    }
    return context;
}