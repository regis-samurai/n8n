import { OptionsWithUri } from 'request';
import {
	ILoadOptionsFunctions,
	IPollFunctions
} from 'n8n-core';

import { IDataObject, IExecuteFunctions } from 'n8n-workflow';

export async function vtexApiRequest(this: ILoadOptionsFunctions | IPollFunctions | IExecuteFunctions , method: string, resource: string, body: any = {}, qs: IDataObject = {}, uri?: string, option: IDataObject = {}): Promise<any> { // tslint:disable-line:no-any
	const credentials = this.getCredentials('vtexApi');
	if (credentials === undefined) {
		throw new Error('No credentials got returned!');
	}
	const BASE_URL = `https://${credentials.account}.vtexcommercestable.com.br/api`;

	const options: OptionsWithUri = {
		headers: {
			'Content-Type': 'application/json',
			'X-VTEX-API-AppKey': credentials.appKey as string,
			'X-VTEX-API-AppToken': credentials.appToken as string,
		},
		method,
		qs,
		body,
		uri: `${BASE_URL}/${resource}`,
		json: true
	};

	console.log("Options: ", options)
	try {
		return await this.helpers.request!(options);
	} catch (error) {

		// let errorMessage = error.message;
		// if (error.response.body && error.response.body.message) {
		// 	errorMessage = `[${error.response.body.status_code}] ${error.response.body.message}`;
		// }

		throw new Error('Vtex Error: ' + error);
	}
}

export async function vtexApiRequestAllItems(this: IExecuteFunctions | ILoadOptionsFunctions, method: string, endpoint: string, body: any = {}, query: IDataObject = {}): Promise<any> { // tslint:disable-line:no-any

	const returnData: IDataObject[] = [];

	let responseData;
	let responeSku;
	let uri: string | undefined;
	query.pagesize = 1000;
	query.page = 1;
	do {
		responseData = await vtexApiRequest.call(this, method, endpoint, body, query, uri, { resolveWithFullResponse: true });
		returnData.push.apply(returnData, responseData);
		query.page += 1;
	} while (
		responseData.length
	);

	console.log("Return data: ", returnData)

	// for(let i = 0; i < returnData.length; i++) {
	// 	responeSku = await getSku.call(this, returnData[i]); 
	// }
	for(let i = 0; i < 10; i++) {
		responeSku = await getSku.call(this, returnData[i]); 
	}

	console.log("Response SKU: ", responeSku)

	return returnData;
}

export async function getSku(this: IExecuteFunctions | ILoadOptionsFunctions, skuId: any): Promise<any> { // tslint:disable-line:no-any

	const returnData: IDataObject[] = [];

	let responseData;
	const endpoint = `catalog_system/pvt/sku/stockkeepingunitbyid/${skuId}`
	const method = 'GET'
	const body = {}
	const query = {}
	let uri: string | undefined;
	
	responseData = await vtexApiRequest.call(this, method, endpoint, body, query, uri, { resolveWithFullResponse: true });
	returnData.push.apply(returnData, responseData);
	
} 


