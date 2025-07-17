// Replace with your actual credentials
const key = 'BymGlAv6CzqrnvpqZJm9blhcsFZL9ipPz6Dk8yGRGhJUQ0MA';
const secret = 'qqb09TWfTRoFywh76B4BZw1WgGbeKluFTaGXrd3lTfZx35CMv85Mfc5iKuQdhXDS';

const credentials = `${key}:${secret}`;
const base64Credentials = Buffer.from(credentials).toString('base64');
console.log('Base64 Encoded Auth:', base64Credentials);
