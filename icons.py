import os
import fontforge

font = fontforge.font()
font.fullname = "rtnicon"
font.familyname = "rtnicon"
font.fontname = "rtnicon"

icons, cursor = "", 0xE900
for name in sorted(os.listdir("icons")):
    if not name.endswith(".svg"):
        continue

    c = font.createChar(cursor)
    c.importOutlines(os.path.join("icons", name))
    c.width = 1000

    x1, y1, x2, y2 = c.boundingBox()
    cx, cy = (x1 + x2) / 2, (y1 + y2) / 2
    w, h = x2 - x1, y2 - y1
    dx, dy = 450 - cx, 300 - cy
    c.transform([1, 0, 0, 1, dx, dy])

    icons += "export const ICON_" + name[:-4].upper() + " = " + hex(cursor) + ";\n"
    cursor += 1

font.generate("./assets/font/rtnicon.ttf")
with open("./src/ui/icons.ts", "w") as f:
    f.write(icons)
