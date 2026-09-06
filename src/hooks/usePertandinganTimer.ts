import {
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";

import {
    usePertandinganStore,
} from "../stores/pertandinganStore";

import {
    updateTimer as updateTimerApi,
} from "../api/turnament/pertandingan/pertandingan";

interface UsePertandinganTimerOptions {
    pertandinganId: number;
    isController?: boolean;
    autoSync?: boolean;
    onTimeUp?: () => void;
}

export const usePertandinganTimer = ({
    pertandinganId,
    isController = false,
    autoSync = false,
    onTimeUp,
}: UsePertandinganTimerOptions) => {

    const {
        activePertandingan,
        updateActivePertandingan,
    } = usePertandinganStore();

    const [timeLeft, setTimeLeft] =
        useState(0);

    const [running, setRunning] =
        useState(false);

    const timeRef =
        useRef(0);

    const previousRoundRef =
        useRef<number | null>(null);

    const previousStatusRef =
        useRef<string | null>(null);

    const timeUpTriggeredRef =
        useRef(false);

    useEffect(() => {
        timeRef.current = timeLeft;
    }, [timeLeft]);

    useEffect(() => {

        if (!activePertandingan) {
            return;
        }

        const currentRound =
            activePertandingan.ronde_aktif;

        const currentStatus =
            activePertandingan.status;

        const serverTime =
            activePertandingan.sisa_detik ?? 0;

        const previousRound =
            previousRoundRef.current;

        const previousStatus =
            previousStatusRef.current;

        if (previousRound === null) {

            setTimeLeft(serverTime);

            timeRef.current =
                serverTime;

            setRunning(
                isController &&
                currentStatus === "berlangsung"
            );

            timeUpTriggeredRef.current =
                serverTime <= 0;

        } else if (
            currentRound !== previousRound
        ) {

            setTimeLeft(serverTime);

            timeRef.current =
                serverTime;

            setRunning(
                isController &&
                currentStatus === "berlangsung"
            );

            timeUpTriggeredRef.current =
                serverTime <= 0;

        } else if (
            currentStatus === "pause"
        ) {

            setTimeLeft(serverTime);

            timeRef.current =
                serverTime;

            setRunning(false);

            timeUpTriggeredRef.current =
                serverTime <= 0;

        } else if (
            currentStatus === "berlangsung"
        ) {

            if (
                isController &&
                !running
            ) {

                setTimeLeft(serverTime);

                timeRef.current =
                    serverTime;

                setRunning(true);
            }

        } else if (
            currentStatus === "selesai"
        ) {

            setTimeLeft(0);

            timeRef.current = 0;

            setRunning(false);
        }

        previousRoundRef.current =
            currentRound;

        previousStatusRef.current =
            currentStatus;

    }, [
        activePertandingan?.id,
        activePertandingan?.ronde_aktif,
        activePertandingan?.status,
        activePertandingan?.sisa_detik,
        isController,
        running,
    ]);

    useEffect(() => {

        if (
            !isController ||
            !running
        ) {
            return;
        }

        const interval =
            window.setInterval(() => {

                setTimeLeft((current) => {

                    if (current <= 1) {

                        window.clearInterval(
                            interval
                        );

                        timeRef.current = 0;

                        setRunning(false);

                        if (
                            !timeUpTriggeredRef.current
                        ) {

                            timeUpTriggeredRef.current =
                                true;

                            onTimeUp?.();
                        }

                        return 0;
                    }

                    const next =
                        current - 1;

                    timeRef.current =
                        next;

                    return next;
                });

            }, 1000);

        return () => {
            window.clearInterval(interval);
        };

    }, [
        isController,
        running,
        onTimeUp,
    ]);

    const syncTimer =
        useCallback(
            async (value?: number) => {

                if (!isController) {
                    return null;
                }

                if (
                    activePertandingan?.status !==
                    "berlangsung"
                ) {
                    return null;
                }

                const seconds =
                    value ??
                    timeRef.current;

                const result =
                    await updateTimerApi(
                        pertandinganId,
                        {
                            sisa_detik: seconds,
                        }
                    );

                if (result) {
                    updateActivePertandingan(
                        result
                    );
                }

                return result;

            },
            [
                pertandinganId,
                isController,
                activePertandingan?.status,
                updateActivePertandingan,
            ]
        );

    const setTimer =
        useCallback(
            (seconds: number) => {

                const safeSeconds =
                    Math.max(
                        0,
                        Math.min(
                            180,
                            Math.floor(seconds)
                        )
                    );

                setTimeLeft(
                    safeSeconds
                );

                timeRef.current =
                    safeSeconds;

                updateActivePertandingan({
                    sisa_detik:
                        safeSeconds,
                });

            },
            [
                updateActivePertandingan,
            ]
        );

    const startTimer =
        useCallback(() => {

            if (!isController) {
                return;
            }

            timeUpTriggeredRef.current =
                false;

            setRunning(true);

        }, [
            isController,
        ]);

    const stopTimer =
        useCallback(() => {

            setRunning(false);

        }, []);

    useEffect(() => {

        if (
            !isController ||
            !autoSync ||
            !running
        ) {
            return;
        }

        const interval =
            window.setInterval(() => {

                syncTimer()
                    .catch(() => {});

            }, 5000);

        return () => {

            window.clearInterval(
                interval
            );

        };

    }, [
        isController,
        autoSync,
        running,
        syncTimer,
    ]);

    const formattedTime =
        `${String(
            Math.floor(
                timeLeft / 60
            )
        ).padStart(2, "0")}:${String(
            timeLeft % 60
        ).padStart(2, "0")}`;

    return {
        timeLeft,
        formattedTime,
        running,
        setTimer,
        startTimer,
        stopTimer,
        syncTimer,
    };
};