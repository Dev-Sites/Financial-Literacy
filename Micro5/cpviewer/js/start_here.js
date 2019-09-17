/* NEW FUNCTIONS */

var NOT_FOUND_URL = "cpviewer/blank.htm";

var xmlDoc;
var resourcesHash, itemsHash;
var metaHTMLFragment;


/* Update title in header */
function updateHeader() {
	var unitTitle;
	unitTitle = xmlDoc.getElementsByTagName("organizations")[0].getElementsByTagName("title")[0].firstChild.nodeValue;
	window.frames[0].document.getElementById("itemTitle").innerHTML = unitTitle;
}

/* Create a hashTable associating identifiers of resources defined in the XML manifest to their href */
function parseResources() {
	var resElements, i, elem, identifier;

	resourcesHash = new Hashtable();
	resElements = xmlDoc.getElementsByTagName("resource");

	for (i = 0; i < resElements.length; i += 1) {
		elem = resElements[i];
		identifier = elem.getAttribute("identifier");
		// Check the identifier exists
		if (identifier !== null) {
			// Add new entry in Hashtable
			resourcesHash.put(identifier, elem.getAttribute("href"));
		}
	}
}

/* Create a hashtable storing all items defined in the XML manifest as objects
 * Item object format:
 *		- title: the text of the navigation link associated with the item
 *		- level: the hierarchy level of the item (starting at 0)
 *		- href: the URL of the page associated with the item
 */
function parseItems() {
	var itemElements, i, elem, level, parentItem, href, newItem;

	itemsHash = new Hashtable();
	itemElements = xmlDoc.getElementsByTagName("item");

	for (i = 0; i < itemElements.length; i += 1) {
		elem = itemElements[i];

		if (elem.getAttribute("isvisible") === "false") {
			continue;
		}

		// Calculate level of element inside 'organization' element
		if (elem.parentNode.tagName === "organization") {
			level = 0;
		} else {
			parentItem = itemsHash.get(elem.parentNode.getAttribute("identifier"));
			if (!parentItem) {
				continue;
			}
			level = parentItem.level + 1;
		}

		// If identifierRef does not refer to any resource, set href to blank.htm
		href = resourcesHash.get(elem.getAttribute("identifierref"));
		if (!href) {
			href = NOT_FOUND_URL;
		}

		newItem = {
			title: elem.getElementsByTagName("title")[0].firstChild.nodeValue,
			level: level,
			href: href
		};
		itemsHash.put(elem.getAttribute("identifier"), newItem);
	}
}

function makeOnClickFunction(linkElem) {
	return function () {
		return frames[1].openLink(linkElem);
	};
}

/* Populate navigation list using items hashtable */
function createNavigation() {
	var documentObj, path, currentItem, nextItem, listElem, listElemStack, listItemElem, parentListItemElemStack, linkElem, idAtt, hrefAtt, classAtt, i;

	listElemStack = [];
	parentListItemElemStack = [];

	documentObj = window.frames[1].document;
	listElem = documentObj.getElementById("root_list");
	listElemStack.push(listElem);

	// Get the local path of the files
	path = document.location.href.substring(0, document.location.href.indexOf("start_here.htm"));

	// Loop through items hashtable
	itemsHash.moveFirst();
	while (itemsHash.next()) {
		currentItem = itemsHash.getValue();

		// Create list item element
		listItemElem = documentObj.createElement("li");
		// Create link element
		linkElem = documentObj.createElement("a");
		// Set link element's attributes
		idAtt = documentObj.createAttribute("id");
		idAtt.nodeValue = "link" + itemsHash.location;
		hrefAtt = documentObj.createAttribute("href");
		hrefAtt.nodeValue = path + currentItem.href;
		linkElem.setAttributeNode(idAtt);
		linkElem.setAttributeNode(hrefAtt);
		// Register onclick event
		linkElem.onclick = makeOnClickFunction(linkElem);

		// Set link text
		linkElem.appendChild(documentObj.createTextNode(currentItem.title));
		// Append link element to list item element
		listItemElem.appendChild(linkElem);
		// Append list element to list
		listElem.appendChild(listItemElem);

		// Test that the item is not the last one
		if ((itemsHash.location + 1) < itemsHash.size()) {
			// Retrieve the next item
			nextItem = itemsHash.get(itemsHash.keys[itemsHash.location + 1]);

			// Test if the next item is a child of the current item
			if (nextItem.level > currentItem.level) {
				// If it is, push the lastly created list item at the end of the parentListItem stack
				parentListItemElemStack.push(listItemElem);

				// Add a symbol at the end of the text of the link to indicate the presence of a sublist
				linkElem.firstChild.nodeValue += " > ";

				// Create a new sublist, set its class name to 'hide', and push it to the end of the listElem stack
				listElem = documentObj.createElement("ul");
				classAtt = documentObj.createAttribute("class");
				classAtt.nodeValue = "hide";
				listElem.setAttributeNode(classAtt);
				listElemStack.push(listElem);
			} else if (nextItem.level < currentItem.level) {
				// If the next item level is less than the current item level, it means the current list is complete and
				// needs to be appended to its parent list item, eventually on more than one hierarchy level
				for (i = currentItem.level; i > nextItem.level; i -= 1) {
					// Append the sublist to its parent list item, and pop both elements out of their respective stack
					parentListItemElemStack.pop().appendChild(listElemStack.pop());

					// Retrieve, from the stack, the deepest list element which filling - with items - is not yet complete
					listElem = listElemStack[listElemStack.length - 1];
				}
			}
		} else {
			// If the item is the last one, append all remaining sublists in the stack to their parent list item
			for (i = currentItem.level; i > 0; i -= 1) {
				parentListItemElemStack.pop().appendChild(listElemStack.pop());
			}
		}
	}
}

function loadXMLAsText(fileName) {
	var request;

	request = new XMLHttpRequest();
	try {
		request.open("GET", fileName, false);
	} catch (exc0) {
		// IE8 blocks cross domain request (file:///)
		//alert("Access denied. Trying ActiveXObject method...");
		request = new ActiveXObject("Msxml2.XMLHTTP");
		request.open("GET", fileName, false);
	}

	try {
		request.send();
	} catch (exc1) {
		return "";
	}
	
	return request.responseText;
}

function parseMetaData() {
	var metadataElem, metaChildElements, childElem, splitTagName, locationElem, extXMLFile, xml, xsl, parser, xsltProcessor, xmlDocument, xslDocument, xslt, i;

	// Retrieve 'metadata' element and its children elements
	metadataElem = xmlDoc.getElementsByTagName("metadata")[0];
	metaChildElements = new Hashtable();
	for (i = 0; i < metadataElem.childNodes.length; i += 1) {
		childElem = metadataElem.childNodes[i];
		if (childElem.nodeType === 1) {
			splitTagName = childElem.tagName.split(":");
			metaChildElements.put(splitTagName[splitTagName.length - 1], childElem);
		}
	}

	// Detect schema and load XML and XSL documents accordingly
	locationElem = metaChildElements.get("location");
	if (locationElem) {
		// SCORM package: load the external XML metadata file
		if (locationElem.firstChild) {
			extXMLFile = locationElem.firstChild.nodeValue;
		}

		try {
			xml = loadXMLAsText(extXMLFile);
		} catch (exc0) {
			// External metadata file not found.";
			xml = "";
		}
		xsl = parent.loadXMLAsText("cpviewer/xsl/meta_scorm.xsl");

	} else if (metaChildElements.get("lom")) {
		// Simply use the already parsed XML manifest
		xmlDocument = xmlDoc;
		xsl = parent.loadXMLAsText("cpviewer/xsl/meta_ims.xsl");

	} else {
		xml = "";
		xsl = parent.loadXMLAsText("cpviewer/xsl/meta_scorm.xsl");
	}

	// Parse XML and XSL result strings and use the resulting objects to create an HTML fragment
	if (window.DOMParser && window.XSLTProcessor) {
		// All browser except IE
		parser = new DOMParser();
		if (!xmlDocument) {
			xmlDocument = parser.parseFromString(xml, "text/xml");
		}
		xslDocument = parser.parseFromString(xsl, "text/xml");

		xsltProcessor = new XSLTProcessor();
		try {
			xsltProcessor.importStylesheet(xslDocument);
			metaHTMLFragment = xsltProcessor.transformToFragment(xmlDocument, document);
		} catch (exc1) {}
	} else if (window.ActiveXObject) {
		if (!xmlDocument) {
			xmlDocument = new ActiveXObject("Msxml2.DOMDocument");
			xmlDocument.loadXML(xml);
		}
		xslDocument = new ActiveXObject("Msxml2.FreeThreadedDOMDocument");
		xslDocument.loadXML(xsl);

		xslt = new ActiveXObject("Msxml2.XSLTemplate");
		
		try {
			xslt.stylesheet = xslDocument;
			xsltProcessor = xslt.createProcessor();
			xsltProcessor.input = xmlDocument;
			xsltProcessor.transform();
			metaHTMLFragment = xsltProcessor.output;
		} catch (exc2) {}
	}
}


function initPlayer() {
	updateHeader();

	parseResources();
	parseItems();
	createNavigation();

	parseMetaData();

	frames[1].openDefaultPage();
}


/* Load IMS Manifest XML file
 * This function is not compatible with IE6 */
function loadIMSManifest() {
	var request, parser;

	request = new XMLHttpRequest();
	try {
		request.open("GET", "imsmanifest.xml", true);
	} catch (exc) {
		// IE8 blocks cross domain request (file:///)
		//alert("Access denied. Trying ActiveXObject method...");
		request = new ActiveXObject("Msxml2.XMLHTTP");
		request.open("GET", "imsmanifest.xml", true);
	}

	request.onreadystatechange = function () {
		if (request.readyState === 4) {
			// Parse XML result string
			if (window.DOMParser) { // All browser except IE
				parser = new DOMParser();
				xmlDoc = parser.parseFromString(request.responseText, "text/xml");
			} else if (window.ActiveXObject) { // Internet Explorer
				xmlDoc = new ActiveXObject("Msxml2.DOMDocument");
				xmlDoc.loadXML(request.responseText);
			}
			//alert("XML parsed");
			initPlayer();
		}
	};

	request.send();
}

window.onload = function () {
	loadIMSManifest();
};


