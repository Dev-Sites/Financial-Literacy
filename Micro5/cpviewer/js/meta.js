/* SCRIPT FOR PAGE 'meta.htm' */

function appendMetaData() {
	var tempFrag, bodyTag;

	if (!parent.metaHTMLFragment) {
		return;
	}
	
	bodyTag = document.getElementsByTagName("body")[0];

	if (parent.metaHTMLFragment.toString().indexOf("DocumentFragment") !== -1) {
		// appendChild() removes the nodes from the HTML fragment as they are inserted in the document
		// Therefore, we need to clone the initial fragment in order to be able to display the metadata page more than once
		tempFrag = parent.metaHTMLFragment.cloneNode(true);
		bodyTag.innerHTML = "";
		bodyTag.appendChild(parent.metaHTMLFragment);
		parent.metaHTMLFragment = tempFrag;
	} else {
		bodyTag.innerHTML = parent.metaHTMLFragment;
	}
}

window.onload = function () {
	appendMetaData();
};


