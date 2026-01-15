const parser = (url) => {
    const cleanUrl = url.split('?')[0];
    const boolFiltered = cleanUrl.split('/').filter(Boolean);
    pathName = '/' + boolFiltered[0] || '';
    resourceId = boolFiltered[1] || '';
    return {pathName, resourceId};
}

module.exports = parser;