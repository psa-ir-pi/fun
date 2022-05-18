import axios from "axios";

export function objToQueryString(obj) {
	const keyValuePairs = [];
	for (const key in obj) {
		keyValuePairs.push(
			encodeURIComponent(key) + "=" + encodeURIComponent(obj[key])
		);
	}
	return keyValuePairs.join("&");
}

export function requestData(url, paramObject, method) {
  axios.defaults.baseURL = "http://localhost:53535/api";
	return axios.request({
		url: url + objToQueryString(paramObject),
		method: method,
		headers: {
			Pragma: "no-cache"
		}
	})
	.then(response => {
		return response;
	})
	.catch(error => {
		return error;
	});
}

function sortJSONObjects(data, prop, desc) {
  return data.sort(function(a, b) {
    if (desc) {
      return b[prop] > a[prop] ? 1 : b[prop] < a[prop] ? -1 : 0;
    } else {
      return a[prop] > b[prop] ? 1 : a[prop] < b[prop] ? -1 : 0;
    }
  });
}

export function getTableDataFromJSONObject(
  jsonData,
  pageSize,
  page,
  sorted,
  dataKey
) {
  let startIndex = 0;
  let endIndex = pageSize;
  if (page > 0) {
    startIndex = page * pageSize;
    endIndex = startIndex + pageSize;
  }
  //jsonData = sortJSONObjects(jsonData, sorted[0].id, sorted[0].desc);
  return new Promise((resolve, reject) => {
    if (jsonData) {
      let rows = {
        rows: [
          {
            [dataKey]: jsonData.slice(startIndex, endIndex)
          }
        ],
        pages: Math.ceil(jsonData.length / pageSize),
        totalRecords: jsonData.length
      };
      resolve(rows);
    } else {
      reject("Error");
    }
  });
}