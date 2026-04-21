import type { INodeProperties } from 'n8n-workflow';

const showOnlyForCompany = {
	resource: ['company'],
};

export const companyDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForCompany,
		},
		options: [
			{
				name: 'Enrich by Domain',
				value: 'enrich',
				action: 'Enrich a company by domain',
				description:
					'Get 88+ operational signals for a company domain — infrastructure, hiring, compliance, ghost-job rate, and more',
				routing: {
					request: {
						method: 'GET',
						url: '/api/v1/enrich',
					},
				},
			},
		],
		default: 'enrich',
	},
	{
		displayName: 'Domain',
		name: 'domain',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'stripe.com',
		description:
			'The company domain to enrich. Apex form preferred (stripe.com, not www.stripe.com or subdomain.stripe.com).',
		displayOptions: {
			show: {
				resource: ['company'],
				operation: ['enrich'],
			},
		},
		routing: {
			send: {
				type: 'query',
				property: 'domain',
			},
		},
	},
];
