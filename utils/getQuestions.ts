import { dataScienceQuestions } from "@/data/dataScienceQuestions";
import { hardwareQuestions } from "@/data/hardwareQuestions";
import { aiQuestions } from "../data/aiQuestions";
import { cloudQuestions } from "../data/cloudQuestions";
import { cybersecurityQuestions } from "../data/cybersecurityQuestions";
import { databaseQuestions } from "../data/databaseQuestions";
import { digitalLogicQuestions } from "../data/digitalLogicQuestions";
import { ecommerceQuestions } from "../data/ecommerceQuestions";
import { iotQuestions } from "../data/iotQuestions";
import { itEthicsQuestions } from "../data/itEthicsQuestions";
import { itHistoryQuestions } from "../data/itHistoryQuestions";
import { mobileDevQuestions } from "../data/mobileDevQuestions";
import { networkingQuestions } from "../data/networkingQuestions";
import { osConceptsQuestions } from "../data/osConceptQuestions"; // ✅ fixed filename
import { programmingQuestions } from "../data/programmingQuestions";
import { projectManagementQuestions } from "../data/projectManagementQuestions";
import { softwareQuestions } from "../data/softwareQuestions";
import { systemAnalysisQuestions } from "../data/systemAnalysisQuestions";
import { uiuxQuestions } from "../data/uiuxQuestions";
import { webDevQuestions } from "../data/webDevQuestions";

export const getQuestionsByTopic = (topic: string) => {
  switch (topic) {
    case "software":
      return softwareQuestions;
    case "hardware":
      return hardwareQuestions;
    case "networking":
      return networkingQuestions;
    case "programming":
      return programmingQuestions;
    case "database":
      return databaseQuestions;
    case "ai":
      return aiQuestions;
    case "cybersecurity":
      return cybersecurityQuestions;
    case "cloud":
      return cloudQuestions;
    case "iot":
      return iotQuestions;
    case "dataScience":
      return dataScienceQuestions;
    case "osConcepts":
      return osConceptsQuestions;
    case "webDev":
      return webDevQuestions;
    case "mobileDev":
      return mobileDevQuestions;
    case "digitalLogic":
      return digitalLogicQuestions;
    case "uiux":
      return uiuxQuestions;
    case "ecommerce":
      return ecommerceQuestions;
    case "systemAnalysis":
      return systemAnalysisQuestions;
    case "projectManagement":
      return projectManagementQuestions;
    case "itEthics":
      return itEthicsQuestions;
    case "itHistory":
      return itHistoryQuestions;
    default:
      console.warn(`⚠️ No questions found for topic: ${topic}`);
      return [];
  }
};
