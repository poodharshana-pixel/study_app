
from lxml import etree

xml = etree.parse("employees.xml")
xsl = etree.parse("employees.xsl")

transform = etree.XSLT(xsl)
result = transform(xml)

with open("employees.html", "wb") as f:
    f.write(etree.tostring(result, method="html", pretty_print=True))

print("Transformation successful! Open employees.html")
