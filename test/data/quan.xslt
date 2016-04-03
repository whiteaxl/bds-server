<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<xsl:template match="/">
{tinh: [
  <xsl:for-each select="Workbook/Worksheet/Table/Row">
    {
    	placeID: "<xsl:value-of select="Cell[1]/Data"/>",
    	placeName: "<xsl:value-of select="Cell[2]/Data"/>",
    	placeType: "Quan"
    },
  </xsl:for-each>
]
}
</xsl:template>
</xsl:stylesheet>

