import { evenOrOdd } from "./8-initiate/even-or-odd";
import { extractTheDomainNameFromAUrl1 } from "./5-adept/extract-the-domain-name-from-a-url-1";
import { multiply } from "./8-initiate/multiply";
import { returnNegative } from "./8-initiate/return-negative";
import { reversedString } from "./8-initiate/reversed-strings";
import { positiveSum } from "./8-initiate/sum-of-positive";
import { vowelCount } from "./7-apprentice/vowel-count";
import { disemvowelTrolls } from "./7-apprentice/disemvowel-trolls";
import { squareDigits } from "./7-apprentice/square-every-digit";
import { highAndLow } from "./7-apprentice/'highest-and-lowest";
import { descendingOrder } from "./7-apprentice/descending-order";
import { whoLikesIt } from "./6-journeyman/who-likes-it";
import { stopSpinning } from "./6-journeyman/stop-gninnips-my-sdrow";
import { digitalRoot } from "./6-journeyman/sum-of-digits-slash-digital-root";
import { createPhoneNumber } from "./6-journeyman/create-phone-number";
import { findTheParityOutlier } from "./6-journeyman/find-the-parity-outlier";
import { moveZeros } from "./5-adept/moving-zeros-to-the-end";
import { pigIt } from "./5-adept/simple-pig-latin";

export const problemMapper = {
    "multiply": multiply,
    "return-negative": returnNegative,
    "even-or-odd": evenOrOdd,
    "sum-of-positive": positiveSum,
    "reversed-strings": reversedString,
    "vowel-count": vowelCount,
    "disemvowel-trolls": disemvowelTrolls,
    "create-phone-number": createPhoneNumber,
    "square-every-digit": squareDigits,
    "highest-and-lowest": highAndLow,
    "descending-order": descendingOrder,
    "stop-gninnips-my-sdrow": stopSpinning,
    "sum-of-digits-slash-digital-root": digitalRoot,
    "find-the-parity-outlier": findTheParityOutlier,
    "extract-the-domain-name-from-a-url-1": extractTheDomainNameFromAUrl1,
    "who-likes-it": whoLikesIt,
    "moving-zeros-to-the-end": moveZeros,
    "simple-pig-latin": pigIt,
  };  

export const allTags = [
    "Mathematics",
    "Fundamentals",
    "Debugging",
    "Parsing",
    "Regular Expressions",
    "Arrays"
]