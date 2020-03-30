import {
	ICredentialType,
	NodePropertyTypes,
} from 'n8n-workflow';


export class VtexApi implements ICredentialType {
	name = 'vtexApi';
	displayName = 'VTEX API';
	properties = [
		{
			displayName: 'Account name',
			name: 'account',
			type: 'string' as NodePropertyTypes,
			default: '',
		},
		{
			displayName: 'X-VTEX-API-AppKey',
			name: 'appKey',
			type: 'string' as NodePropertyTypes,
			default: '',
		},
		{
			displayName: 'X-VTEX-API-AppToken',
			name: 'appToken',
			type: 'string' as NodePropertyTypes,
			default: '',
		}
	];
}