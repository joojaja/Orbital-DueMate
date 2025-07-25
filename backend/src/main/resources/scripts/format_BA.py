import json

with open("../db/formatted_2425_modules.json", "r", encoding="utf-8") as file:
    modules = json.load(file)

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

core_courses = {
    "MA1521", "MA1522", "BT2101", "BT2102", "CS2030", "CS2040", "IS2101", "ST2334",
    "BT3103", "IS3103", "BT4103", "BT4101"
}

programme_electives = {
    "IE3120", "IS3150", "IS3240", "BT4013", "BT4016", "BT4211", "BT4212", "DBA4811", "IS4241",
    "IS4242", "IS4250", "IS4262", "BT3017", "BT3102", "BT3104", "CS3243", "CS3244", "CS4248",
    "BT4012", "BT4015", "BT4221", "BT4222", "BT4240", "BT4241", "ST424", "IS3107", "IS3221",
    "BT4014", "BT4301", "IS4226", "IS4228", "IS4234", "IS4246", "IS4302", "IS4303"
}

for module in modules:
    code = module["moduleCode"]

    if code == "CS1010A":
        module["category"] = "Digital Literacy"
        module["subcategory"] = "University Pillars"
    elif code == "BT1101":
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
    elif code in core_courses:
        module["category"] = "Core Course"
    elif code in programme_electives:
        module["category"] = "Programme Elective"
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
    else:
        module["category"] = "Unrestricted Elective"

    if code.startswith("CS"):
        module["subcategory"] = "CS"
    elif code.startswith("IS"):
        module["subcategory"] = "IS"
    elif code.startswith("BT"):
        module["subcategory"] = "BT"
    elif code.startswith("ST"):
        module["subcategory"] = "ST"
    elif code.startswith("DBA"):
        module["subcategory"] = "DBA"
    elif code.startswith("IE"):
        module["subcategory"] = "IE"

with open("../db/modules_formatted_BA.json", "w", encoding="utf-8") as file:
    json.dump(modules, file, indent=2)