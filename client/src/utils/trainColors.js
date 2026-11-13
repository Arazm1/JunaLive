
const HSL_LINES = new Set(['A', 'E', 'L', 'U', 'Y', 'I', 'P', 'K']);
const VR_LINES = new Set(['D', 'R', 'T', 'Z', 'G', 'H', 'R', 'M', 'O']);

const HSL_LINES_MAIN = new Set(['K']);
const HSL_LINES_RING = new Set(['I', 'P']);
const HSL_LINES_COASTAL = new Set(['A', 'E', 'L', 'U', 'Y']);


export function trainBadgeStyle(train) {
    if (!train.commuterLine) return "";   // Kaukojunat: no coloring for now.

    // HSL Main Line
    if (HSL_LINES_MAIN.has(train.commuterLine)) {
        return "border-black bg-[#8C4799] text-white";
    }
    // HSL Ring Rail
    if (HSL_LINES_RING.has(train.commuterLine)) {
        return "border-black bg-sky-600 text-white";
    }
    // HSL Coastal Line
    if (HSL_LINES_COASTAL.has(train.commuterLine)) {
        return "border-black bg-fuchsia-600 text-white";
    }

    // VR Commuter Lines
    if (VR_LINES.has(train.commuterLine)) {
        return "border-black bg-[#00873E] text-white";
    }

    return "border-gray-400 bg-gray-100 text-gray-700";
    
}


/**
 * OLD COLORING
 * 
 * //HSL Lines
    if(HSL_LINES_MAIN.has(train.commuterLine)){
        return "border-black bg-purple-700 text-white";
    }
    if(HSL_LINES_RING.has(train.commuterLine)){
        return "border-black bg-purple-600 text-white";
    }
    if(HSL_LINES_COASTAL.has(train.commuterLine)){
        return "border-black bg-purple-500 text-white";
    }

    //VR Lines
    if(VR_LINES.has(train.commuterLine)){
        return "border-black bg-green-700 text-white"
    }

    // Unknown line
    return "border-gray-400 bg-gray-100 text-gray-700";
 * 
 */