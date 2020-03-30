import { IExecuteFunctions } from 'n8n-core';
import {
	IDataObject,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

import {
	vtexApiRequest,
	vtexApiRequestAllItems,
} from './GenericFunctions';

export class Vtex implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Vtex',
		name: 'vtex',
		icon: 'file:vtex.png',
		group: ['transform'],
		version: 1,
		description: 'Node to consume VTEX APIs',
		defaults: {
			name: 'Vtex',
			color: '#EC3C62',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'vtexApi',
				required: true,
			}
		],
		properties: [
			// Node properties which the user gets displayed and
			// can change on the node.
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				options: [
					{
						name: 'Product',
						value: 'product'
					},
					{
						name: 'Order',
						value: 'order'
					},
				],
				default: 'product',
				description: 'The resource to operate on.',
			},



			// ----------------------------------
			//         operations
			// ----------------------------------
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				displayOptions: {
					show: {
						resource: [
							'product'
						]
					}
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						description: 'Get products'
					}
				],
				default: 'get',
				description: 'The resource to operate on.'
			},

			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				displayOptions: {
					show: {
						resource: [
							'order'
						]
					}
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						description: 'Get orders'
					},
					{
						name: 'Create',
						value: 'create',
						description: 'Create orders'
					}
				],
				default: 'get',
				description: 'The resource to operate on.',
			}
		]
	};


	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		console.log("Items: ", items)
		const returnData: IDataObject[] = [];
		let responseData;

		const credentials = this.getCredentials('vtexApi');
		console.log("Credentials: ", credentials)

		if (credentials === undefined) {
			throw new Error('No credentials got returned!');
		}

		let item: INodeExecutionData;
		let myString: string;

		const operation = this.getNodeParameter('operation', 0) as string;
		const resource = this.getNodeParameter('resource', 0) as string;
		console.log("OP, RE: ", operation, resource)

		// Itterates over all input items and add the key "myString" with the
		// value the parameter "myString" resolves to.
		// (This could be a different value for each item in case it contains an expression)
		for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
			if(resource === 'product') {
				if(operation === 'get') {
					responseData = await vtexApiRequestAllItems.call(this, 'GET', 'catalog_system/pvt/sku/stockkeepingunitids', {}, {})
				}
			}

			if(Array.isArray(responseData)) {
				returnData.push.apply(returnData, responseData as IDataObject[])
			} else {
				returnData.push(responseData as IDataObject);
			}


			// myString = this.getNodeParameter('myString', itemIndex, '') as string;
			// item = items[itemIndex];

			// item.json['myString'] = myString;
		}

		// return this.prepareOutputData(items);
		console.log("Returned data: ", this.helpers.returnJsonArray(returnData))
		return [this.helpers.returnJsonArray(returnData)];

	}
}