<?xml version="1.0" encoding="ISO-8859-1"?>

<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
	xmlns:ims="http://www.imsglobal.org/xsd/imscp_v1p1" xmlns:imsmd="http://ltsc.ieee.org/xsd/LOM">

	<xsl:output omit-xml-declaration="yes"/>

	<xsl:template match="/">
		<xsl:call-template name="basicMetadata"/>
		<xsl:call-template name="showVetadataRecord"/>
	</xsl:template>
	
	<xsl:template name="basicMetadata">
		<h2><xsl:value-of select="ims:manifest/ims:metadata/imsmd:lom/imsmd:general/imsmd:title/imsmd:string"/></h2>
		<div>
			<dl>
				<dt>Description:</dt>
					<dd><xsl:value-of select="ims:manifest/ims:metadata/imsmd:lom/imsmd:general/imsmd:description/imsmd:string"/></dd>
				<xsl:for-each select="ims:manifest/ims:metadata/imsmd:lom/imsmd:classification">
                <dt><xsl:choose>
                        <xsl:when test="imsmd:purpose/imsmd:value='competency'">Competency:</xsl:when>
                        <xsl:when test="imsmd:purpose/imsmd:value='educational level'">Educational Level:</xsl:when>
                        <xsl:when test="imsmd:purpose/imsmd:value='discipline'">Discipline:</xsl:when>
                        <xsl:otherwise>
                            <xsl:value-of select="imsmd:purpose/imsmd:value"/>:
                        </xsl:otherwise>
                    </xsl:choose></dt>
                    <dd><xsl:value-of select="imsmd:description/imsmd:string"/></dd>
				</xsl:for-each>
				<dt>Version:</dt>
					<dd><xsl:value-of select="ims:manifest/ims:metadata/imsmd:lom/imsmd:lifeCycle/imsmd:version/imsmd:string"/></dd>
            </dl>
			<div id="license">
            	<dl>
					<dt>Licence information:</dt>
					<xsl:apply-templates select="ims:manifest/ims:metadata/imsmd:lom/imsmd:rights/imsmd:description/imsmd:string" mode="parseCopyrightDescription"/>
                    <dd><span class="license_item">COST:</span>
                    <xsl:choose>
                        <xsl:when test="ims:manifest/ims:metadata/imsmd:lom/imsmd:rights/imsmd:cost/imsmd:value='no'">
                            $0.00
                        </xsl:when>
                        <xsl:otherwise>
                            <xsl:value-of select="ims:manifest/ims:metadata/imsmd:lom/imsmd:rights/imsmd:cost/imsmd:value"/>
                        </xsl:otherwise>
                    </xsl:choose></dd>
                </dl>
			</div>
		</div>
	</xsl:template>
	
	<!-- parse copyright description -->
	<xsl:template match="node()" mode="parseCopyrightDescription" name="parseCopyrightDescription">
		<xsl:param name="string" select="."/>
		<xsl:choose>
			<!-- if the string contains a semicolon. -->
			<xsl:when test="contains($string, ';')">
				<!-- Display the part before the first colon. -->
				<dd><span class="license_item">
					<!-- (but replace underscore characters with spaces_ -->
					<xsl:call-template name="replace-string">
						<xsl:with-param name="text" select="substring-before($string, ':')" />
						<xsl:with-param name="from" select="'_'" />
						<xsl:with-param name="to" select="' '" />
					</xsl:call-template>
					<!--<xsl:value-of select="substring-before($string, ':')"/>-->
					<xsl:text>: </xsl:text>
				</span>
				<!-- Display the part between the first colon and the first semicolon. -->
				<xsl:choose>
					<!--If the part before the colon contains 'URL', 
						format the part between the first colon and the first semicolon
						as a url. -->
					<xsl:when test="contains(substring-before($string, ':'),'URL')">
						<a href="{substring-before(substring-after($string, ':'), ';')}" target="_blank"><xsl:value-of select="substring-before(substring-after($string, ':'), ';')" /></a>
					</xsl:when>
					<xsl:otherwise>
						<xsl:value-of select="substring-before(substring-after($string, ':'), ';')" />
					</xsl:otherwise>
				</xsl:choose></dd>
                
				<!-- and then call the template recursively on the rest of the string -->
				<xsl:call-template name="parseCopyrightDescription">
					<xsl:with-param name="string" select="substring-after($string, ';')"/>
				</xsl:call-template>
				
			</xsl:when>
			
			<!-- if the string doesn't contain a semicolon, just return its value. -->
			<xsl:otherwise>
				<xsl:value-of select="$string"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
    
	<!-- reusable replace-string function -->
	<xsl:template name="replace-string">
		<xsl:param name="text"/>
		<xsl:param name="from"/>
		<xsl:param name="to"/>
		
		<xsl:choose>
			<xsl:when test="contains($text, $from)">
				
				<xsl:variable name="before" select="substring-before($text, $from)"/>
				<xsl:variable name="after" select="substring-after($text, $from)"/>
				<xsl:variable name="prefix" select="concat($before, $to)"/>
				
				<xsl:value-of select="$before"/>
				<xsl:value-of select="$to"/>
				<xsl:call-template name="replace-string">
					<xsl:with-param name="text" select="$after"/>
					<xsl:with-param name="from" select="$from"/>
					<xsl:with-param name="to" select="$to"/>
				</xsl:call-template>
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="$text"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>

	<xsl:template name="showVetadataRecord">
		<div>
			<table align="center" width="95%" border="0">
			<xsl:call-template name="startSection">
				<xsl:with-param name="title">1.0 General</xsl:with-param>
			</xsl:call-template>

			<xsl:call-template name="showValue">
				<xsl:with-param name="title">Title</xsl:with-param>
				<xsl:with-param name="node" select="ims:manifest/ims:metadata/imsmd:lom/imsmd:general/imsmd:title/imsmd:string"/>
			</xsl:call-template>

			<xsl:call-template name="showValue">
				<xsl:with-param name="title">Description</xsl:with-param>
				<xsl:with-param name="node" select="ims:manifest/ims:metadata/imsmd:lom/imsmd:general/imsmd:description/imsmd:string"/>
			</xsl:call-template>

			<xsl:call-template name="showValue">
				<xsl:with-param name="title">Keywords</xsl:with-param>
				<xsl:with-param name="node" select="ims:manifest/ims:metadata/imsmd:lom/imsmd:general/imsmd:keyword/*"/>
			</xsl:call-template>

			<xsl:call-template name="showValue">
				<xsl:with-param name="title">Catalog</xsl:with-param>
				<xsl:with-param name="node" select="ims:manifest/ims:metadata/imsmd:lom/imsmd:general/imsmd:identifier/imsmd:catalog"/>
			</xsl:call-template>

			<xsl:call-template name="showValue">
				<xsl:with-param name="title">Catalog Entry</xsl:with-param>
				<xsl:with-param name="node" select="ims:manifest/ims:metadata/imsmd:lom/imsmd:general/imsmd:identifier/imsmd:entry"/>
			</xsl:call-template>

			<xsl:call-template name="showValue">
				<xsl:with-param name="title">Aggregation Level</xsl:with-param>
				<xsl:with-param name="node" select="ims:manifest/ims:metadata/imsmd:lom/imsmd:general/imsmd:aggregationLevel/*"/>
			</xsl:call-template>

			<xsl:call-template name="endSection"> </xsl:call-template>
			</table>
			<table align="center" width="95%" border="0">
			<xsl:call-template name="startSection">
				<xsl:with-param name="title">2.0 Lifecycle</xsl:with-param>
			</xsl:call-template>

			<xsl:call-template name="showValue">
				<xsl:with-param name="title">Version</xsl:with-param>
				<xsl:with-param name="node" select="ims:manifest/ims:metadata/imsmd:lom/imsmd:lifeCycle/imsmd:version/imsmd:string"/>
			</xsl:call-template>

			<xsl:call-template name="showValue">
				<xsl:with-param name="title">Status</xsl:with-param>
				<xsl:with-param name="node" select="ims:manifest/ims:metadata/imsmd:lom/imsmd:lifeCycle/imsmd:status/*"/>
			</xsl:call-template>

			<xsl:call-template name="showValue">
				<xsl:with-param name="title">Contributer Role</xsl:with-param>
				<xsl:with-param name="node" select="ims:manifest/ims:metadata/imsmd:lom/imsmd:lifeCycle/imsmd:contribute/imsmd:role/*"/>
			</xsl:call-template>

			<xsl:call-template name="showValue">
				<xsl:with-param name="title">Contributer Date</xsl:with-param>
				<xsl:with-param name="node" select="ims:manifest/ims:metadata/imsmd:lom/imsmd:lifeCycle/imsmd:contribute/imsmd:date/imsmd:dateTime"/>
			</xsl:call-template>

			<xsl:call-template name="showValue">
				<xsl:with-param name="title">Contributer Entity</xsl:with-param>
				<xsl:with-param name="node" select="ims:manifest/ims:metadata/imsmd:lom/imsmd:lifeCycle/imsmd:contribute/imsmd:entity"/>
			</xsl:call-template>

			<xsl:call-template name="endSection"> </xsl:call-template>

			</table>
			<table align="center" width="95%" border="0">
			<xsl:call-template name="startSection">
				<xsl:with-param name="title">3.0 Meta-metadata</xsl:with-param>
			</xsl:call-template>

			<xsl:call-template name="showValue">
				<xsl:with-param name="title">Metadata scheme</xsl:with-param>
				<xsl:with-param name="node" select="ims:manifest/ims:metadata/imsmd:lom/imsmd:metaMetadata/imsmd:metadataSchema"/>
			</xsl:call-template>

			<xsl:call-template name="endSection"> </xsl:call-template>

			</table>
			<table align="center" width="95%" border="0">
			<xsl:call-template name="startSection">
				<xsl:with-param name="title">4.0 Technical</xsl:with-param>
			</xsl:call-template>

			<xsl:call-template name="showValue">
				<xsl:with-param name="title">Format</xsl:with-param>
				<xsl:with-param name="node" select="ims:manifest/ims:metadata/imsmd:lom/imsmd:technical/imsmd:format"/>
			</xsl:call-template>

			<xsl:call-template name="showValue">
				<xsl:with-param name="title">Location</xsl:with-param>
				<xsl:with-param name="node" select="ims:manifest/ims:metadata/imsmd:lom/imsmd:technical/imsmd:location"/>
			</xsl:call-template>

			<xsl:call-template name="endSection"> </xsl:call-template>

			</table>
			<table align="center" width="95%" border="0">
			<xsl:call-template name="startSection">
				<xsl:with-param name="title">5.0 Rights</xsl:with-param>
			</xsl:call-template>

			<xsl:call-template name="showValue">
				<xsl:with-param name="title">Cost</xsl:with-param>
				<xsl:with-param name="node" select="ims:manifest/ims:metadata/imsmd:lom/imsmd:rights/imsmd:cost/*"/>
			</xsl:call-template>

			<xsl:call-template name="showValue">
				<xsl:with-param name="title">Copyright</xsl:with-param>
				<xsl:with-param name="node" select="ims:manifest/ims:metadata/imsmd:lom/imsmd:rights/imsmd:copyrightAndOtherRestrictions/*"/>
			</xsl:call-template>

			<xsl:call-template name="showValue">
				<xsl:with-param name="title">Description</xsl:with-param>
				<xsl:with-param name="node" select="ims:manifest/ims:metadata/imsmd:lom/imsmd:rights/imsmd:description/imsmd:string"/>
			</xsl:call-template>

			<xsl:call-template name="endSection"> </xsl:call-template>
            
			</table>

			<xsl:for-each select="ims:manifest/ims:metadata/imsmd:lom/imsmd:classification">
			<table align="center" width="95%" border="0">
				<xsl:call-template name="startSection">
					<xsl:with-param name="title">9.<xsl:value-of select="position()" /> Classification: <xsl:value-of
							select="imsmd:purpose/imsmd:value"/></xsl:with-param>
				</xsl:call-template>

				<xsl:call-template name="showValue">
					<xsl:with-param name="title">Purpose</xsl:with-param>
					<xsl:with-param name="node" select="imsmd:purpose/*"/>
				</xsl:call-template>

				<xsl:call-template name="showValue">
					<xsl:with-param name="title">Taxonpath, source</xsl:with-param>
					<xsl:with-param name="node" select="imsmd:taxonPath/imsmd:source/imsmd:string"/>
				</xsl:call-template>

				<xsl:call-template name="showValue">
					<xsl:with-param name="title">Taxonpath, taxon, id</xsl:with-param>
					<xsl:with-param name="node" select="imsmd:taxonPath/imsmd:taxon/imsmd:id"/>
				</xsl:call-template>

				<xsl:call-template name="showValue">
					<xsl:with-param name="title">Taxonpath, taxon, entry</xsl:with-param>
					<xsl:with-param name="node" select="imsmd:taxonPath/imsmd:taxon/imsmd:entry/imsmd:string"/>
				</xsl:call-template>

				<xsl:call-template name="showValue">
					<xsl:with-param name="title">Description</xsl:with-param>
					<xsl:with-param name="node" select="imsmd:description/imsmd:string"/>
				</xsl:call-template>

				<xsl:call-template name="showValue">
					<xsl:with-param name="title">Keyword</xsl:with-param>
					<xsl:with-param name="node" select="imsmd:keyword/imsmd:string"/>
				</xsl:call-template>
				<xsl:call-template name="endSection"> </xsl:call-template>
            </table>
			</xsl:for-each>
		</div>
	</xsl:template>

	<xsl:template name="showValue">
		<xsl:param name="title"/>
		<xsl:param name="node"/>
	        <tbody>
                <tr>
                    <td align="left" width="5%"></td>
                    <th scope="row" width="20%"><xsl:value-of select="$title"/></th>
                    <td>
                        <xsl:for-each select="$node">
                            <xsl:value-of select="."/><xsl:text> </xsl:text>
                        </xsl:for-each>
                    </td>
                </tr>
            </tbody>
	</xsl:template>

	<xsl:template name="startSection">
		<xsl:param name="title"/>
        	<thead>
                <tr>
                    <th colspan="3" align="left">
                        <h3><xsl:value-of select="$title"/></h3>
                    </th>
                </tr>
            </thead>
	</xsl:template>

	<xsl:template name="endSection">
    		<tfoot>
                <tr>
                    <td colspan="3"><br /></td>
                </tr>
            </tfoot>
	</xsl:template>

</xsl:stylesheet>
