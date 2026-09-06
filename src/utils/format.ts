export const capitalizeWords = (text: string): string => {
    if (!text) return "";

    return text
        .toLowerCase()
        .split(" ")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
};

export const capitalizeFirst = (text: string): string => {
    if (!text) return "";

    return text.charAt(0).toUpperCase() + text.slice(1);
};

export const formatEmail = (email: string) => {
    const [name, domain] = email.split("@");
    return `${capitalizeWords(name)}@${domain.toLowerCase()}`;
};