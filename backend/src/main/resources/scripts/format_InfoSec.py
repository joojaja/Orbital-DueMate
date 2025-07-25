import json

with open("../db/formatted_2425_modules.json", "r", encoding="utf-8") as file:
    modules = json.load(file)

data_literacy = {"GEA1000", "BT1101", "ST1131", "DSE1101"}

interdisciplinary = {
    "CDE2501", "EG2501", "DTK1234", "EG1311", "IE2141", "PF1101A", "IS1128", "IS2218", "IS2238",
    "HSH1000", "HSS1000", "HSA1000", "HSI1000", "HSI2001", "HSI2002", "HSI2003", "HSI2004",
    "HSI2005", "HSI2007", "HSI2008", "HSI2009", "HSI2010", "HSI2011", "HSI2013", "HSI2014"
}

cross_disciplinary = {
    "ACC1701X", "DAO2703", "MNO1706X", "SC1101E", "EL1101E", "PE2101P", "GE2103", "XD3103",
    "GE3253", "GE3255", "GE3256", "SPH2002", "SC2226", "NUR1113A", "CDE2300", "CDE2310",
    "EG2201A", "EG2310"
}

computing_foundation = {
    "CS1231S", "CS2030", "CS2040C", "CS2100", "CS2101", "CS2103T", "CS2105", "CS2106",
    "CS2107", "CS3235", "IFS4205", "IS4231"
}

programme_elective = {
    "CS4230", "CS4236", "MA4261", "CS4238", "CS4239", "CS4257", "CS4276", "CS5231",
    "CS5321", "CS5322", "CS5331", "CS5332", "IFS4101", "IFS4102", "IFS4103", "IS4204",
    "IS4233", "IS4234", "IS4238", "IS4302"
}

internship = {"CP3200", "CP3202", "CP3880"}


for module in modules:
    code = module["moduleCode"]

    if code == "CS1010":
        module["category"] = "Digital Literacy"
        module["subcategory"] = "University Pillars"
    elif code in data_literacy:
        module["category"] = "Data Literacy"
        module["subcategory"] = "University Pillars"
    elif code == "IS1108":
        module["category"] = "Computing Ethics"
        module["subcategory"] = "University Pillars"
    elif code in interdisciplinary:
        module["category"] = "Interdisciplinary"
        module["subcategory"] = "University Pillars"
    elif code in cross_disciplinary:
        module["category"] = "Cross-Disciplinary"
        module["subcategory"] = "University Pillars"
    elif code in computing_foundation:
        module["category"] = "Computing Foundation"
    elif code in programme_elective:
        module["category"] = "Programme Elective"
    elif code in internship:
        module["category"] = "Internship"
    elif code.startswith("GEX"):
        module["category"] = "Critique and Expression"
        module["subcategory"] = "University Pillars"
    elif code.startswith("GEC"):
        module["category"] = "Cultures and Connections"
        module["subcategory"] = "University Pillars"
    elif code.startswith("GES"):
        module["category"] = "Singapore Studies"
        module["subcategory"] = "University Pillars"
    elif code.startswith("GEN"):
        module["category"] = "Communities and Engagement"
        module["subcategory"] = "University Pillars"
    elif code.startswith(("CS", "IS", "CP")):
        module["category"] = "Computing Requirement"
    elif code == "MA1521"  or code == "MA1522" or code == "ST2334":
        module["category"] = "Mathematics and Sciences"
    else:
        module["category"] = "Unrestricted Elective"

    if code.startswith("CS"):
        module["subcategory"] = "CS"
    elif code.startswith("IS"):
        module["subcategory"] = "IS"
    elif code.startswith("CP"):
        module["subcategory"] = "CP"

with open("../db/modules_formatted_InfoSec.json", "w", encoding="utf-8") as file:
    json.dump(modules, file, indent=2)