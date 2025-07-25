import json
import re

with open("../db/original_2425_modules.json", "r", encoding="utf-8") as file:
    modules = json.load(file)

newModules = []

for module in modules:
    moduleCode = module["moduleCode"]
    moduleCredit = module["moduleCredit"]

    # Get first number from moduleCode for level
    level = int(re.search(r"\d", moduleCode).group())

    new_module = {
        "moduleCode": moduleCode,
        "moduleCredit": moduleCredit,
        "category": "NA",
        "subcategory": "NA",
        "subsubcategory": "NA",
        "level": level,
        "secondCategory": "NA"
    }

    newModules.append(new_module)

with open("../db/formatted_2425_modules.json", "w", encoding="utf-8") as file:
    json.dump(newModules, file, indent=2)