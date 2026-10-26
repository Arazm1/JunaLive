// Edit this set to match HSL's current network
const HSL_LINES = new Set(['A', 'E', 'L', 'U', 'Y', 'I', 'P', 'K']);
const VR_LINES = new Set(['D', 'R', 'T', 'Z', 'G', 'H', 'R', 'M', 'O']);

export function trainBadgeStyle(train) {
    if (!train.commuterLine) return "";   // Kaukojunat: no coloring for now.


    if(HSL_LINES.has(train.commuterLine)){
        return "border-black bg-purple-500 text-white";
    }
    if(VR_LINES.has(train.commuterLine)){
        return "border-black bg-green-700 text-white"
    }

    // Unknown line
    return "border-gray-400 bg-gray-100 text-gray-700";
}