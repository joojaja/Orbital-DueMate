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
    "BT2102", "CS2102", "CS2030", "CS2040", "IS2101", "IS2102", "IS2103", "IS3103", "IS3106",
    "CP4101", "IS4103", "MA1521", "ST2334"
}

programme_electives = {
    "IS3150", "IS3240", "IS4151", "IS4262", "IS4226", "IS4228", "IS4302", "IS4303", "CS2105",
    "BT3017", "CS3240", "CS3243", "IS3107", "IS3221", "BT4014", "IS4100", "IS4234", "IS4236",
    "IS4243", "IS4246", "IS4248", "IS4250", "IS4301", "IS3251", "IS4152", "IS4241", "IS4242",
    "IS4261", "CS2107", "IFS4101", "IS4231", "IS4233", "IS4238"
}

for module in modules:
    code = module["moduleCode"]

    if code == "CS1010J":
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

with open("../db/modules_formatted_IS.json", "w", encoding="utf-8") as file:
    json.dump(modules, file, indent=2)