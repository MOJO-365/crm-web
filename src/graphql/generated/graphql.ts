/* eslint-disable */
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = T | null | undefined;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Date: { input: any; output: any; }
  JSON: { input: Record<string, unknown>; output: Record<string, unknown>; }
};

export type AccessibleFeature = {
  __typename?: 'AccessibleFeature';
  featureCode: Scalars['String']['output'];
  featureName: Scalars['String']['output'];
  featureUid: Scalars['String']['output'];
  isEnabled: Scalars['Boolean']['output'];
};

export type AccessibleMenu = {
  __typename?: 'AccessibleMenu';
  canCreate: Scalars['Boolean']['output'];
  canDelete: Scalars['Boolean']['output'];
  canEdit: Scalars['Boolean']['output'];
  canView: Scalars['Boolean']['output'];
  menuCode: Scalars['String']['output'];
  menuName: Scalars['String']['output'];
  menuUid: Scalars['String']['output'];
  parentUid?: Maybe<Scalars['String']['output']>;
  sortOrder?: Maybe<Scalars['Int']['output']>;
};

export type AuditLog = {
  __typename?: 'AuditLog';
  changedAt: Scalars['Date']['output'];
  changedBy?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  newValues?: Maybe<Scalars['String']['output']>;
  oldValues?: Maybe<Scalars['String']['output']>;
  operation: Scalars['String']['output'];
  recordId?: Maybe<Scalars['String']['output']>;
  tableName: Scalars['String']['output'];
  uid: Scalars['String']['output'];
};

export type AuthTokens = {
  __typename?: 'AuthTokens';
  accessToken: Scalars['String']['output'];
  message?: Maybe<Scalars['String']['output']>;
  refreshToken: Scalars['String']['output'];
};

export type BulkEmailResult = {
  __typename?: 'BulkEmailResult';
  failedCount?: Maybe<Scalars['Int']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  sentCount?: Maybe<Scalars['Int']['output']>;
  success: Scalars['Boolean']['output'];
};

export type ChangePasswordInput = {
  newPassword: Scalars['String']['input'];
  oldPassword: Scalars['String']['input'];
};

export type ChangedRatePlan = {
  __typename?: 'ChangedRatePlan';
  newRecord?: Maybe<Scalars['String']['output']>;
  oldRecord?: Maybe<Scalars['String']['output']>;
  uid: Scalars['String']['output'];
};

export type CreateCustomerInput = {
  abn?: InputMaybe<Scalars['String']['input']>;
  address?: InputMaybe<CustomerAddressInput>;
  batteryDetails?: InputMaybe<CustomerBatterySystemInput>;
  businessName?: InputMaybe<Scalars['String']['input']>;
  checkCreditScore?: InputMaybe<Scalars['Int']['input']>;
  creditScore?: InputMaybe<Scalars['Int']['input']>;
  customerId?: InputMaybe<Scalars['String']['input']>;
  debitDetails?: InputMaybe<CustomerDebitDetailsInput>;
  discount?: InputMaybe<Scalars['Float']['input']>;
  dob?: InputMaybe<Scalars['Date']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  emailSent?: InputMaybe<Scalars['Int']['input']>;
  employerName?: InputMaybe<Scalars['String']['input']>;
  enquiryAmount?: InputMaybe<Scalars['Float']['input']>;
  enrollmentDetails?: InputMaybe<CustomerEnrollmentDetailsInput>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  gender?: InputMaybe<Scalars['Int']['input']>;
  identityProof?: InputMaybe<Scalars['String']['input']>;
  isCreditScoreFetched?: InputMaybe<Scalars['Int']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  licenseDocument?: InputMaybe<Scalars['String']['input']>;
  msatDetails?: InputMaybe<CustomerMsatInput>;
  number?: InputMaybe<Scalars['String']['input']>;
  pdfAudit?: InputMaybe<Scalars['String']['input']>;
  phoneVerifiedAt?: InputMaybe<Scalars['Date']['input']>;
  previousBill?: InputMaybe<Scalars['String']['input']>;
  previousCustomerUid?: InputMaybe<Scalars['String']['input']>;
  propertyType?: InputMaybe<Scalars['Int']['input']>;
  rateVersion?: InputMaybe<Scalars['String']['input']>;
  relationshipStatus?: InputMaybe<Scalars['Int']['input']>;
  riskStatus?: InputMaybe<Scalars['String']['input']>;
  showAsBusinessName?: InputMaybe<Scalars['Boolean']['input']>;
  showName?: InputMaybe<Scalars['Boolean']['input']>;
  signDate?: InputMaybe<Scalars['Date']['input']>;
  signatureBase64?: InputMaybe<Scalars['String']['input']>;
  signedPdfPath?: InputMaybe<Scalars['String']['input']>;
  solarDetails?: InputMaybe<CustomerSolarSystemInput>;
  status?: InputMaybe<Scalars['Int']['input']>;
  tariffCode?: InputMaybe<Scalars['String']['input']>;
  tenant?: InputMaybe<Scalars['String']['input']>;
  utilmateDetails?: InputMaybe<CustomerUtilmateInput>;
  utilmateStatus?: InputMaybe<Scalars['Int']['input']>;
  utilmateUploadedManually?: InputMaybe<Scalars['Int']['input']>;
  vppCertificateDetails?: InputMaybe<CustomerVppCertificateDetailsInput>;
  vppDetails?: InputMaybe<CustomerVppInput>;
};

export type CreateEmailTemplateInput = {
  body?: InputMaybe<Scalars['String']['input']>;
  entityType?: InputMaybe<Scalars['Int']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  name: Scalars['String']['input'];
  status?: InputMaybe<Scalars['Int']['input']>;
  subject: Scalars['String']['input'];
  tenant?: InputMaybe<Scalars['String']['input']>;
};

export type CreateMenuInput = {
  code: Scalars['String']['input'];
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  name: Scalars['String']['input'];
  parentUid?: InputMaybe<Scalars['String']['input']>;
};

export type CreateNotificationEntityInput = {
  bccEmail?: InputMaybe<Scalars['String']['input']>;
  entityType: Scalars['Int']['input'];
  fromEmail: Scalars['String']['input'];
  password?: InputMaybe<Scalars['String']['input']>;
  preference?: InputMaybe<Scalars['Int']['input']>;
  userUids?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type CreatePdfTermInput = {
  content?: InputMaybe<Scalars['String']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  name: Scalars['String']['input'];
  rateType?: InputMaybe<Scalars['String']['input']>;
  rateUids?: InputMaybe<Array<Scalars['String']['input']>>;
  tenant?: InputMaybe<Scalars['String']['input']>;
};

export type CreatePermissionInput = {
  canCreate?: InputMaybe<Scalars['Boolean']['input']>;
  canDelete?: InputMaybe<Scalars['Boolean']['input']>;
  canEdit?: InputMaybe<Scalars['Boolean']['input']>;
  canView?: InputMaybe<Scalars['Boolean']['input']>;
  menuUid: Scalars['String']['input'];
  roleUid: Scalars['String']['input'];
};

export type CreateRateOfferInput = {
  anytime?: InputMaybe<Scalars['Float']['input']>;
  cl1Supply?: InputMaybe<Scalars['Float']['input']>;
  cl1Usage?: InputMaybe<Scalars['Float']['input']>;
  cl2Supply?: InputMaybe<Scalars['Float']['input']>;
  cl2Usage?: InputMaybe<Scalars['Float']['input']>;
  demand?: InputMaybe<Scalars['Float']['input']>;
  demandOp?: InputMaybe<Scalars['Float']['input']>;
  demandP?: InputMaybe<Scalars['Float']['input']>;
  demandS?: InputMaybe<Scalars['Float']['input']>;
  fit?: InputMaybe<Scalars['Float']['input']>;
  fitCritical?: InputMaybe<Scalars['Float']['input']>;
  fitPeak?: InputMaybe<Scalars['Float']['input']>;
  fitVpp?: InputMaybe<Scalars['Float']['input']>;
  offPeak?: InputMaybe<Scalars['Float']['input']>;
  offerName?: InputMaybe<Scalars['String']['input']>;
  peak?: InputMaybe<Scalars['Float']['input']>;
  priceUnits?: InputMaybe<Scalars['JSON']['input']>;
  ratePlanUid: Scalars['String']['input'];
  shoulder?: InputMaybe<Scalars['Float']['input']>;
  supplyCharge?: InputMaybe<Scalars['Float']['input']>;
  tenant?: InputMaybe<Scalars['String']['input']>;
  uid?: InputMaybe<Scalars['String']['input']>;
  vppOrcharge?: InputMaybe<Scalars['Float']['input']>;
};

export type CreateRatePlanInput = {
  codes?: InputMaybe<Scalars['String']['input']>;
  discountApplies?: InputMaybe<Scalars['Int']['input']>;
  discountPercentage?: InputMaybe<Scalars['Float']['input']>;
  dnsp?: InputMaybe<Scalars['Int']['input']>;
  offers?: InputMaybe<Array<RateOfferInput>>;
  planId?: InputMaybe<Scalars['String']['input']>;
  state?: InputMaybe<Scalars['String']['input']>;
  tariff?: InputMaybe<Scalars['String']['input']>;
  tenant?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['Int']['input']>;
  uid?: InputMaybe<Scalars['String']['input']>;
  vpp?: InputMaybe<Scalars['Int']['input']>;
};

export type CreateRoleInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  tenant?: InputMaybe<Scalars['String']['input']>;
};

export type CreateUserInput = {
  email: Scalars['String']['input'];
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  number?: InputMaybe<Scalars['String']['input']>;
  password: Scalars['String']['input'];
  roleUid?: InputMaybe<Scalars['String']['input']>;
  tenant?: InputMaybe<Scalars['String']['input']>;
};

export type CursorPaginatedCustomers = {
  __typename?: 'CursorPaginatedCustomers';
  data: Array<Customer>;
  pageInfo: PageInfo;
};

export type Customer = {
  __typename?: 'Customer';
  abn?: Maybe<Scalars['String']['output']>;
  address?: Maybe<CustomerAddress>;
  batteryDetails?: Maybe<CustomerBatterySystem>;
  businessName?: Maybe<Scalars['String']['output']>;
  checkCreditScore?: Maybe<Scalars['Int']['output']>;
  createdAt: Scalars['Date']['output'];
  createdBy?: Maybe<Scalars['String']['output']>;
  creditScore?: Maybe<Scalars['Int']['output']>;
  customerId?: Maybe<Scalars['String']['output']>;
  debitDetails?: Maybe<CustomerDebitDetails>;
  deletedBy?: Maybe<Scalars['String']['output']>;
  discount?: Maybe<Scalars['Float']['output']>;
  dob?: Maybe<Scalars['Date']['output']>;
  documents?: Maybe<Array<Maybe<CustomerDocument>>>;
  email?: Maybe<Scalars['String']['output']>;
  emailLogCount?: Maybe<Scalars['Int']['output']>;
  emailSent?: Maybe<Scalars['Int']['output']>;
  employerName?: Maybe<Scalars['String']['output']>;
  enquiryAmount?: Maybe<Scalars['Float']['output']>;
  enrollmentDetails?: Maybe<CustomerEnrollmentDetails>;
  firstName?: Maybe<Scalars['String']['output']>;
  gender?: Maybe<Scalars['Int']['output']>;
  history?: Maybe<CustomerHistory>;
  id: Scalars['ID']['output'];
  identityProof?: Maybe<CustomerDocument>;
  isActive: Scalars['Boolean']['output'];
  isCreditScoreFetched?: Maybe<Scalars['Int']['output']>;
  isDeleted: Scalars['Boolean']['output'];
  lastName?: Maybe<Scalars['String']['output']>;
  licenseDocument?: Maybe<CustomerDocument>;
  message?: Maybe<Scalars['String']['output']>;
  msatDetails?: Maybe<CustomerMsat>;
  number?: Maybe<Scalars['String']['output']>;
  offerEmailSentAt?: Maybe<Scalars['Date']['output']>;
  offerVersion?: Maybe<Scalars['Int']['output']>;
  pdfAudit?: Maybe<Scalars['String']['output']>;
  phoneVerifiedAt?: Maybe<Scalars['Date']['output']>;
  previousBill?: Maybe<CustomerDocument>;
  previousCustomerUid?: Maybe<Scalars['String']['output']>;
  propertyType?: Maybe<Scalars['Int']['output']>;
  rateOffer?: Maybe<RateOffer>;
  ratePlan?: Maybe<RatePlan>;
  rateVersion?: Maybe<Scalars['String']['output']>;
  relationshipStatus?: Maybe<Scalars['Int']['output']>;
  riskStatus?: Maybe<Scalars['String']['output']>;
  showAsBusinessName?: Maybe<Scalars['Boolean']['output']>;
  showName?: Maybe<Scalars['Boolean']['output']>;
  signDate?: Maybe<Scalars['Date']['output']>;
  signatureUrl?: Maybe<Scalars['String']['output']>;
  signedPdfPath?: Maybe<Scalars['String']['output']>;
  solarDetails?: Maybe<CustomerSolarSystem>;
  status?: Maybe<Scalars['Int']['output']>;
  tariffCode?: Maybe<Scalars['String']['output']>;
  tenant: Scalars['String']['output'];
  uid: Scalars['String']['output'];
  updatedAt: Scalars['Date']['output'];
  updatedBy?: Maybe<Scalars['String']['output']>;
  utilmateDetails?: Maybe<CustomerUtilmate>;
  utilmateStatus?: Maybe<Scalars['Int']['output']>;
  utilmateUpdatedAt?: Maybe<Scalars['Date']['output']>;
  utilmateUploadedManually?: Maybe<Scalars['Int']['output']>;
  viewCode?: Maybe<Scalars['String']['output']>;
  vppCertificateDetails?: Maybe<CustomerVppCertificateDetails>;
  vppDetails?: Maybe<CustomerVpp>;
};

export type CustomerAddress = {
  __typename?: 'CustomerAddress';
  country?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['Date']['output'];
  createdBy?: Maybe<Scalars['String']['output']>;
  customerUid: Scalars['String']['output'];
  deletedBy?: Maybe<Scalars['String']['output']>;
  fullAddress?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  isActive: Scalars['Boolean']['output'];
  isDeleted: Scalars['Boolean']['output'];
  nmi?: Maybe<Scalars['String']['output']>;
  postcode?: Maybe<Scalars['String']['output']>;
  state?: Maybe<Scalars['String']['output']>;
  streetName?: Maybe<Scalars['String']['output']>;
  streetNumber?: Maybe<Scalars['String']['output']>;
  streetType?: Maybe<Scalars['String']['output']>;
  suburb?: Maybe<Scalars['String']['output']>;
  unitNumber?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['Date']['output'];
  updatedBy?: Maybe<Scalars['String']['output']>;
};

export type CustomerAddressInput = {
  country?: InputMaybe<Scalars['String']['input']>;
  nmi?: InputMaybe<Scalars['String']['input']>;
  postcode?: InputMaybe<Scalars['String']['input']>;
  state?: InputMaybe<Scalars['String']['input']>;
  streetName?: InputMaybe<Scalars['String']['input']>;
  streetNumber?: InputMaybe<Scalars['String']['input']>;
  streetType?: InputMaybe<Scalars['String']['input']>;
  suburb?: InputMaybe<Scalars['String']['input']>;
  unitNumber?: InputMaybe<Scalars['String']['input']>;
};

export type CustomerBatterySystem = {
  __typename?: 'CustomerBatterySystem';
  batterybrand?: Maybe<Scalars['String']['output']>;
  batterycapacity?: Maybe<Scalars['Float']['output']>;
  checkCode?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['Date']['output'];
  createdBy?: Maybe<Scalars['String']['output']>;
  customerUid: Scalars['String']['output'];
  deletedBy?: Maybe<Scalars['String']['output']>;
  exportlimit?: Maybe<Scalars['Float']['output']>;
  id: Scalars['ID']['output'];
  inverterCapacity?: Maybe<Scalars['Float']['output']>;
  isActive: Scalars['Boolean']['output'];
  isDeleted: Scalars['Boolean']['output'];
  snnumber?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['Date']['output'];
  updatedBy?: Maybe<Scalars['String']['output']>;
};

export type CustomerBatterySystemInput = {
  batterybrand?: InputMaybe<Scalars['String']['input']>;
  batterycapacity?: InputMaybe<Scalars['Float']['input']>;
  checkCode?: InputMaybe<Scalars['String']['input']>;
  exportlimit?: InputMaybe<Scalars['Float']['input']>;
  inverterCapacity?: InputMaybe<Scalars['Float']['input']>;
  snnumber?: InputMaybe<Scalars['String']['input']>;
};

export type CustomerDashboardSummary = {
  __typename?: 'CustomerDashboardSummary';
  signedStatusSummary: SummaryCategory;
  utilmateStatusSummary: SummaryCategory;
  vppPendingSummary: SummaryCategory;
};

export type CustomerDebitDetails = {
  __typename?: 'CustomerDebitDetails';
  abn?: Maybe<Scalars['String']['output']>;
  accountNumber?: Maybe<Scalars['String']['output']>;
  accountType?: Maybe<Scalars['Int']['output']>;
  bankAddress?: Maybe<Scalars['String']['output']>;
  bankName?: Maybe<Scalars['String']['output']>;
  bsb?: Maybe<Scalars['String']['output']>;
  companyName?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['Date']['output'];
  createdBy?: Maybe<Scalars['String']['output']>;
  customerUid: Scalars['String']['output'];
  deletedBy?: Maybe<Scalars['String']['output']>;
  firstDebitDate?: Maybe<Scalars['Date']['output']>;
  firstName?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  isActive: Scalars['Boolean']['output'];
  isDeleted: Scalars['Boolean']['output'];
  lastName?: Maybe<Scalars['String']['output']>;
  optIn?: Maybe<Scalars['Int']['output']>;
  paymentFrequency?: Maybe<Scalars['Int']['output']>;
  tenant?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['Date']['output'];
  updatedBy?: Maybe<Scalars['String']['output']>;
};

export type CustomerDebitDetailsInput = {
  abn?: InputMaybe<Scalars['String']['input']>;
  accountNumber?: InputMaybe<Scalars['String']['input']>;
  accountType?: InputMaybe<Scalars['Int']['input']>;
  bankAddress?: InputMaybe<Scalars['String']['input']>;
  bankName?: InputMaybe<Scalars['String']['input']>;
  bsb?: InputMaybe<Scalars['String']['input']>;
  companyName?: InputMaybe<Scalars['String']['input']>;
  firstDebitDate?: InputMaybe<Scalars['Date']['input']>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  optIn?: InputMaybe<Scalars['Int']['input']>;
  paymentFrequency?: InputMaybe<Scalars['Int']['input']>;
};

export type CustomerDocument = {
  __typename?: 'CustomerDocument';
  createdAt: Scalars['Date']['output'];
  createdBy?: Maybe<Scalars['String']['output']>;
  createdByUser?: Maybe<User>;
  customerUid: Scalars['String']['output'];
  documentType?: Maybe<DocumentType>;
  endDate?: Maybe<Scalars['Date']['output']>;
  filename?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  mimeType?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  path?: Maybe<Scalars['String']['output']>;
  size?: Maybe<Scalars['Int']['output']>;
  startDate?: Maybe<Scalars['Date']['output']>;
  type?: Maybe<Scalars['String']['output']>;
  uid: Scalars['String']['output'];
  updatedAt: Scalars['Date']['output'];
};

export type CustomerEmailLog = {
  __typename?: 'CustomerEmailLog';
  body?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['Date']['output'];
  createdBy?: Maybe<Scalars['String']['output']>;
  customerId?: Maybe<Scalars['String']['output']>;
  customerUid: Scalars['String']['output'];
  emailTo?: Maybe<Scalars['String']['output']>;
  emailType?: Maybe<Scalars['String']['output']>;
  errorMessage?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  sentAt?: Maybe<Scalars['Date']['output']>;
  status: Scalars['Int']['output'];
  subject?: Maybe<Scalars['String']['output']>;
  tenant?: Maybe<Scalars['String']['output']>;
  verificationCode?: Maybe<Scalars['String']['output']>;
  verifiedAt?: Maybe<Scalars['Date']['output']>;
};

export type CustomerEnrollmentDetails = {
  __typename?: 'CustomerEnrollmentDetails';
  billingpreference?: Maybe<Scalars['Int']['output']>;
  concession?: Maybe<Scalars['Int']['output']>;
  connectiondate?: Maybe<Scalars['Date']['output']>;
  createdAt: Scalars['Date']['output'];
  createdBy?: Maybe<Scalars['String']['output']>;
  customerUid: Scalars['String']['output'];
  deletedBy?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  idcountry?: Maybe<Scalars['String']['output']>;
  idexpiry?: Maybe<Scalars['Date']['output']>;
  idnumber?: Maybe<Scalars['String']['output']>;
  idstate?: Maybe<Scalars['String']['output']>;
  idtype?: Maybe<Scalars['Int']['output']>;
  isActive: Scalars['Boolean']['output'];
  isDeleted: Scalars['Boolean']['output'];
  licenseExpiry?: Maybe<Scalars['Date']['output']>;
  licenseNumber?: Maybe<Scalars['String']['output']>;
  licenseState?: Maybe<Scalars['String']['output']>;
  lifesupport?: Maybe<Scalars['Int']['output']>;
  saletype?: Maybe<Scalars['Int']['output']>;
  updatedAt: Scalars['Date']['output'];
  updatedBy?: Maybe<Scalars['String']['output']>;
};

export type CustomerEnrollmentDetailsInput = {
  billingpreference?: InputMaybe<Scalars['Int']['input']>;
  concession?: InputMaybe<Scalars['Int']['input']>;
  connectiondate?: InputMaybe<Scalars['Date']['input']>;
  idcountry?: InputMaybe<Scalars['String']['input']>;
  idexpiry?: InputMaybe<Scalars['Date']['input']>;
  idnumber?: InputMaybe<Scalars['String']['input']>;
  idstate?: InputMaybe<Scalars['String']['input']>;
  idtype?: InputMaybe<Scalars['Int']['input']>;
  licenseExpiry?: InputMaybe<Scalars['Date']['input']>;
  licenseNumber?: InputMaybe<Scalars['String']['input']>;
  licenseState?: InputMaybe<Scalars['String']['input']>;
  lifesupport?: InputMaybe<Scalars['Int']['input']>;
  saletype?: InputMaybe<Scalars['Int']['input']>;
};

export type CustomerHistory = {
  __typename?: 'CustomerHistory';
  createdAt: Scalars['Date']['output'];
  createdBy?: Maybe<Scalars['String']['output']>;
  customerSnapshot: Scalars['String']['output'];
  customerUid: Scalars['String']['output'];
  deletedBy?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  isActive: Scalars['Boolean']['output'];
  isDeleted: Scalars['Boolean']['output'];
  updatedAt: Scalars['Date']['output'];
  version: Scalars['Int']['output'];
};

export type CustomerMsat = {
  __typename?: 'CustomerMsat';
  createdAt: Scalars['Date']['output'];
  createdBy?: Maybe<Scalars['String']['output']>;
  customerUid: Scalars['String']['output'];
  deletedBy?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  isActive: Scalars['Boolean']['output'];
  isDeleted: Scalars['Boolean']['output'];
  msatConnected?: Maybe<Scalars['Int']['output']>;
  msatConnectedAt?: Maybe<Scalars['Date']['output']>;
  msatUpdatedAt?: Maybe<Scalars['Date']['output']>;
  updatedAt: Scalars['Date']['output'];
  updatedBy?: Maybe<Scalars['String']['output']>;
};

export type CustomerMsatInput = {
  msatConnected?: InputMaybe<Scalars['Int']['input']>;
  msatConnectedAt?: InputMaybe<Scalars['Date']['input']>;
  msatUpdatedAt?: InputMaybe<Scalars['Date']['input']>;
};

export type CustomerNote = {
  __typename?: 'CustomerNote';
  assignedTo?: Maybe<Scalars['String']['output']>;
  assignedToUser?: Maybe<User>;
  createdAt: Scalars['Date']['output'];
  createdBy?: Maybe<Scalars['String']['output']>;
  createdByName?: Maybe<Scalars['String']['output']>;
  customerUid: Scalars['String']['output'];
  followUp?: Maybe<Scalars['Date']['output']>;
  id: Scalars['ID']['output'];
  message: Scalars['String']['output'];
  noteTypeDetails?: Maybe<NoteType>;
  type?: Maybe<Scalars['String']['output']>;
  uid: Scalars['String']['output'];
  updatedAt: Scalars['Date']['output'];
  userUid: Scalars['String']['output'];
};

export type CustomerSolarSystem = {
  __typename?: 'CustomerSolarSystem';
  createdAt: Scalars['Date']['output'];
  createdBy?: Maybe<Scalars['String']['output']>;
  customerUid: Scalars['String']['output'];
  deletedBy?: Maybe<Scalars['String']['output']>;
  hassolar?: Maybe<Scalars['Int']['output']>;
  id: Scalars['ID']['output'];
  invertercapacity?: Maybe<Scalars['Float']['output']>;
  isActive: Scalars['Boolean']['output'];
  isDeleted: Scalars['Boolean']['output'];
  solarcapacity?: Maybe<Scalars['Float']['output']>;
  updatedAt: Scalars['Date']['output'];
  updatedBy?: Maybe<Scalars['String']['output']>;
};

export type CustomerSolarSystemInput = {
  hassolar?: InputMaybe<Scalars['Int']['input']>;
  invertercapacity?: InputMaybe<Scalars['Float']['input']>;
  solarcapacity?: InputMaybe<Scalars['Float']['input']>;
};

export type CustomerSummaryItem = {
  __typename?: 'CustomerSummaryItem';
  customerId?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  firstName?: Maybe<Scalars['String']['output']>;
  lastName?: Maybe<Scalars['String']['output']>;
  status?: Maybe<Scalars['Int']['output']>;
  uid: Scalars['String']['output'];
  utilmateStatus?: Maybe<Scalars['Int']['output']>;
  vppConnected?: Maybe<Scalars['Int']['output']>;
};

export type CustomerUtilmate = {
  __typename?: 'CustomerUtilmate';
  accountNumber?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['Date']['output'];
  createdBy?: Maybe<Scalars['String']['output']>;
  customerUid: Scalars['String']['output'];
  deletedBy?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  isActive: Scalars['Boolean']['output'];
  isDeleted: Scalars['Boolean']['output'];
  siteIdentifier?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['Date']['output'];
  updatedBy?: Maybe<Scalars['String']['output']>;
  utilmateConnected?: Maybe<Scalars['Int']['output']>;
  utilmateConnectedAt?: Maybe<Scalars['Date']['output']>;
};

export type CustomerUtilmateInput = {
  accountNumber?: InputMaybe<Scalars['String']['input']>;
  siteIdentifier?: InputMaybe<Scalars['String']['input']>;
  utilmateConnected?: InputMaybe<Scalars['Int']['input']>;
  utilmateConnectedAt?: InputMaybe<Scalars['Date']['input']>;
};

export type CustomerVpp = {
  __typename?: 'CustomerVpp';
  createdAt: Scalars['Date']['output'];
  createdBy?: Maybe<Scalars['String']['output']>;
  customerUid: Scalars['String']['output'];
  deletedBy?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  isActive: Scalars['Boolean']['output'];
  isDeleted: Scalars['Boolean']['output'];
  updatedAt: Scalars['Date']['output'];
  updatedBy?: Maybe<Scalars['String']['output']>;
  vpp?: Maybe<Scalars['Int']['output']>;
  vppConnected?: Maybe<Scalars['Int']['output']>;
  vppOrchestration?: Maybe<Scalars['Int']['output']>;
  vppSignupBonus?: Maybe<Scalars['Float']['output']>;
};

export type CustomerVppCertificateDetails = {
  __typename?: 'CustomerVppCertificateDetails';
  additionalNotes?: Maybe<Scalars['String']['output']>;
  apiIntegration?: Maybe<Scalars['Int']['output']>;
  batteryInstalledDate?: Maybe<Scalars['Date']['output']>;
  batteryManufacturer?: Maybe<Scalars['String']['output']>;
  batteryModel?: Maybe<Scalars['String']['output']>;
  batteryPortConnected?: Maybe<Scalars['Int']['output']>;
  batterySerialNumber?: Maybe<Scalars['String']['output']>;
  batteryUsableCapacity?: Maybe<Scalars['Float']['output']>;
  certificateNo?: Maybe<Scalars['String']['output']>;
  communicationFailSafeTest?: Maybe<Scalars['Int']['output']>;
  communicationFailSafeTestAt?: Maybe<Scalars['Date']['output']>;
  createdAt: Scalars['Date']['output'];
  createdBy?: Maybe<Scalars['String']['output']>;
  customerUid: Scalars['String']['output'];
  deletedBy?: Maybe<Scalars['String']['output']>;
  gridExportVerification?: Maybe<Scalars['Int']['output']>;
  gridExportVerificationAt?: Maybe<Scalars['Date']['output']>;
  gridImportVerification?: Maybe<Scalars['Int']['output']>;
  gridImportVerificationAt?: Maybe<Scalars['Date']['output']>;
  id: Scalars['ID']['output'];
  ifYesDetails?: Maybe<Scalars['String']['output']>;
  internetConnectionType?: Maybe<Scalars['Int']['output']>;
  internetOtherText?: Maybe<Scalars['String']['output']>;
  inverterCapacity?: Maybe<Scalars['Float']['output']>;
  inverterManufacturer?: Maybe<Scalars['String']['output']>;
  inverterModel?: Maybe<Scalars['String']['output']>;
  inverterSnNumbers?: Maybe<Scalars['String']['output']>;
  isActive: Scalars['Boolean']['output'];
  isAllRequiredFilled?: Maybe<Scalars['Int']['output']>;
  isDeleted: Scalars['Boolean']['output'];
  isLifeSupportEquipment?: Maybe<Scalars['Int']['output']>;
  isVppCertificateEmailSent?: Maybe<Scalars['Int']['output']>;
  isVppCertificateEmailSentAt?: Maybe<Scalars['Date']['output']>;
  issueDate?: Maybe<Scalars['Date']['output']>;
  modemRouterLocation?: Maybe<Scalars['String']['output']>;
  remoteChargesCommandTest?: Maybe<Scalars['Int']['output']>;
  remoteChargesCommandTestAt?: Maybe<Scalars['Date']['output']>;
  remoteDischargesCommandTest?: Maybe<Scalars['Int']['output']>;
  remoteDischargesCommandTestAt?: Maybe<Scalars['Date']['output']>;
  stateOfChangeMonitoring?: Maybe<Scalars['Int']['output']>;
  stateOfChangeMonitoringAt?: Maybe<Scalars['Date']['output']>;
  testResult?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['Date']['output'];
  updatedBy?: Maybe<Scalars['String']['output']>;
};

export type CustomerVppCertificateDetailsInput = {
  additionalNotes?: InputMaybe<Scalars['String']['input']>;
  apiIntegration?: InputMaybe<Scalars['Int']['input']>;
  batteryInstalledDate?: InputMaybe<Scalars['Date']['input']>;
  batteryManufacturer?: InputMaybe<Scalars['String']['input']>;
  batteryModel?: InputMaybe<Scalars['String']['input']>;
  batteryPortConnected?: InputMaybe<Scalars['Int']['input']>;
  batterySerialNumber?: InputMaybe<Scalars['String']['input']>;
  batteryUsableCapacity?: InputMaybe<Scalars['Float']['input']>;
  certificateNo?: InputMaybe<Scalars['String']['input']>;
  communicationFailSafeTest?: InputMaybe<Scalars['Int']['input']>;
  communicationFailSafeTestAt?: InputMaybe<Scalars['Date']['input']>;
  gridExportVerification?: InputMaybe<Scalars['Int']['input']>;
  gridExportVerificationAt?: InputMaybe<Scalars['Date']['input']>;
  gridImportVerification?: InputMaybe<Scalars['Int']['input']>;
  gridImportVerificationAt?: InputMaybe<Scalars['Date']['input']>;
  ifYesDetails?: InputMaybe<Scalars['String']['input']>;
  internetConnectionType?: InputMaybe<Scalars['Int']['input']>;
  internetOtherText?: InputMaybe<Scalars['String']['input']>;
  inverterCapacity?: InputMaybe<Scalars['Float']['input']>;
  inverterManufacturer?: InputMaybe<Scalars['String']['input']>;
  inverterModel?: InputMaybe<Scalars['String']['input']>;
  inverterSnNumbers?: InputMaybe<Scalars['String']['input']>;
  isAllRequiredFilled?: InputMaybe<Scalars['Int']['input']>;
  isLifeSupportEquipment?: InputMaybe<Scalars['Int']['input']>;
  isVppCertificateEmailSent?: InputMaybe<Scalars['Int']['input']>;
  isVppCertificateEmailSentAt?: InputMaybe<Scalars['Date']['input']>;
  issueDate?: InputMaybe<Scalars['Date']['input']>;
  modemRouterLocation?: InputMaybe<Scalars['String']['input']>;
  remoteChargesCommandTest?: InputMaybe<Scalars['Int']['input']>;
  remoteChargesCommandTestAt?: InputMaybe<Scalars['Date']['input']>;
  remoteDischargesCommandTest?: InputMaybe<Scalars['Int']['input']>;
  remoteDischargesCommandTestAt?: InputMaybe<Scalars['Date']['input']>;
  stateOfChangeMonitoring?: InputMaybe<Scalars['Int']['input']>;
  stateOfChangeMonitoringAt?: InputMaybe<Scalars['Date']['input']>;
  testResult?: InputMaybe<Scalars['String']['input']>;
};

export type CustomerVppInput = {
  vpp?: InputMaybe<Scalars['Int']['input']>;
  vppConnected?: InputMaybe<Scalars['Int']['input']>;
  vppOrchestration?: InputMaybe<Scalars['Int']['input']>;
  vppSignupBonus?: InputMaybe<Scalars['Float']['input']>;
};

export type DocumentType = {
  __typename?: 'DocumentType';
  category?: Maybe<Scalars['String']['output']>;
  color?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['Date']['output'];
  id: Scalars['ID']['output'];
  isActive?: Maybe<Scalars['Int']['output']>;
  name: Scalars['String']['output'];
  tenant: Scalars['String']['output'];
  uid: Scalars['String']['output'];
  updatedAt: Scalars['Date']['output'];
};

export type EmailAttachmentInput = {
  /** Base64 encoded file content */
  content: Scalars['String']['input'];
  /** MIME type */
  contentType?: InputMaybe<Scalars['String']['input']>;
  /** Original filename with extension */
  filename: Scalars['String']['input'];
};

export type EmailSetting = {
  __typename?: 'EmailSetting';
  createdAt: Scalars['Date']['output'];
  eventType: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  isActive: Scalars['Boolean']['output'];
  template?: Maybe<EmailTemplate>;
  templateUid?: Maybe<Scalars['String']['output']>;
  tenant?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['Date']['output'];
};

export type EmailTemplate = {
  __typename?: 'EmailTemplate';
  body?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['Date']['output'];
  createdBy?: Maybe<Scalars['String']['output']>;
  deletedBy?: Maybe<Scalars['String']['output']>;
  entityType?: Maybe<Scalars['Int']['output']>;
  id: Scalars['ID']['output'];
  isActive: Scalars['Boolean']['output'];
  isDeleted: Scalars['Boolean']['output'];
  message?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  status: Scalars['Int']['output'];
  subject: Scalars['String']['output'];
  tenant?: Maybe<Scalars['String']['output']>;
  uid: Scalars['String']['output'];
  updatedAt: Scalars['Date']['output'];
  updatedBy?: Maybe<Scalars['String']['output']>;
};

export type EmailVerificationResult = {
  __typename?: 'EmailVerificationResult';
  emailLog?: Maybe<CustomerEmailLog>;
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export type Feature = {
  __typename?: 'Feature';
  code: Scalars['String']['output'];
  createdAt: Scalars['Date']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  isActive: Scalars['Boolean']['output'];
  menuUid: Scalars['String']['output'];
  name: Scalars['String']['output'];
  tenant?: Maybe<Scalars['String']['output']>;
  uid: Scalars['String']['output'];
  updatedAt: Scalars['Date']['output'];
};

export type GeneratePdfResult = {
  __typename?: 'GeneratePdfResult';
  filename?: Maybe<Scalars['String']['output']>;
  message: Scalars['String']['output'];
  pdfBase64?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
};

export type LoginInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
  tenant?: InputMaybe<Scalars['String']['input']>;
};

export type MeasurementUnit = {
  __typename?: 'MeasurementUnit';
  createdAt: Scalars['Date']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  isActive: Scalars['Boolean']['output'];
  isDeleted: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  tenant: Scalars['String']['output'];
  uid: Scalars['String']['output'];
  updatedAt: Scalars['Date']['output'];
};

export type Menu = {
  __typename?: 'Menu';
  code: Scalars['String']['output'];
  createdAt: Scalars['Date']['output'];
  createdBy?: Maybe<Scalars['String']['output']>;
  deletedBy?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  isActive: Scalars['Boolean']['output'];
  isDeleted: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  parentUid?: Maybe<Scalars['String']['output']>;
  tenant?: Maybe<Scalars['String']['output']>;
  uid: Scalars['String']['output'];
  updatedAt: Scalars['Date']['output'];
  updatedBy?: Maybe<Scalars['String']['output']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  changePassword: Scalars['Boolean']['output'];
  createCustomer: Customer;
  createCustomerNote: CustomerNote;
  createDocumentType: DocumentType;
  createEmailTemplate: EmailTemplate;
  createMeasurementUnit: MeasurementUnit;
  createMenu: Menu;
  createNoteType: NoteType;
  createNotificationEntity: NotificationEntity;
  createPdfTerm: PdfTerm;
  createPermission: RoleMenuPermission;
  createRateOffer: RateOffer;
  createRatePlan: RatePlan;
  createRatesSnapshot: RatesHistoryRecord;
  createRiskStatus: RiskStatus;
  createRole: Role;
  createUser: User;
  deleteCustomerNote: Scalars['Boolean']['output'];
  deleteDocumentType: Scalars['Boolean']['output'];
  deleteMeasurementUnit: Scalars['Boolean']['output'];
  deleteNoteType: Scalars['Boolean']['output'];
  deleteNotificationEntity: Scalars['Boolean']['output'];
  deleteRiskStatus: Scalars['Boolean']['output'];
  generateCustomerPdf: GeneratePdfResult;
  generateVppCertificate: CustomerVppCertificateDetails;
  hardDeleteCustomer: Scalars['Boolean']['output'];
  hardDeleteEmailTemplate: Scalars['Boolean']['output'];
  hardDeleteMenu: Scalars['Boolean']['output'];
  hardDeletePermission: Scalars['Boolean']['output'];
  hardDeleteRateOffer: Scalars['Boolean']['output'];
  hardDeleteRatePlan: Scalars['Boolean']['output'];
  hardDeleteRole: Scalars['Boolean']['output'];
  hardDeleteUser: Scalars['Boolean']['output'];
  login: AuthTokens;
  refreshToken: AuthTokens;
  register: AuthTokens;
  restoreCustomer: Scalars['Boolean']['output'];
  restoreEmailTemplate: Scalars['Boolean']['output'];
  restoreMenu: Scalars['Boolean']['output'];
  restorePdfTerm: Scalars['Boolean']['output'];
  restorePermission: Scalars['Boolean']['output'];
  restoreRateOffer: Scalars['Boolean']['output'];
  restoreRatePlan: Scalars['Boolean']['output'];
  restoreRatesSnapshot: Scalars['Boolean']['output'];
  restoreRole: Scalars['Boolean']['output'];
  restoreUser: UserOperationResponse;
  sendBulkEmail: BulkEmailResult;
  sendCustomerCredentialsEmail: SendEmailResult;
  sendOfferEmail: SendEmailResult;
  sendReminderEmail: SendEmailResult;
  setActiveRatesVersion: RatesHistoryRecord;
  softDeleteCustomer: Scalars['Boolean']['output'];
  softDeleteEmailTemplate: Scalars['Boolean']['output'];
  softDeleteMenu: Scalars['Boolean']['output'];
  softDeletePdfTerm: Scalars['Boolean']['output'];
  softDeletePermission: Scalars['Boolean']['output'];
  softDeleteRateOffer: Scalars['Boolean']['output'];
  softDeleteRatePlan: Scalars['Boolean']['output'];
  softDeleteRole: Scalars['Boolean']['output'];
  softDeleteUser: UserOperationResponse;
  updateCustomer?: Maybe<Customer>;
  updateCustomerNote?: Maybe<CustomerNote>;
  updateDocumentType: DocumentType;
  updateEmailSetting: EmailSetting;
  updateEmailTemplate: EmailTemplate;
  updateMenu: Menu;
  updateNoteType: NoteType;
  updateNotificationEntity: NotificationEntity;
  updatePdfTerm: PdfTerm;
  updatePermission: RoleMenuPermission;
  updatePermissions: PermissionsUpdateResponse;
  updateRateOffer: RateOffer;
  updateRatePlan: RatePlan;
  updateRatePlans: Array<RatePlan>;
  updateRiskStatus: RiskStatus;
  updateRole: Role;
  updateUser: User;
  uploadFile: UploadFileResult;
  upsertRoleFeaturePermission: RoleFeaturePermission;
  upsertUserFeaturePermission: UserFeaturePermission;
  upsertUserPermission: UserMenuPermission;
  verifyEmailCode: EmailVerificationResult;
};


export type MutationChangePasswordArgs = {
  input: ChangePasswordInput;
};


export type MutationCreateCustomerArgs = {
  input: CreateCustomerInput;
};


export type MutationCreateCustomerNoteArgs = {
  assignedTo?: InputMaybe<Scalars['String']['input']>;
  customerUid: Scalars['String']['input'];
  followUp?: InputMaybe<Scalars['Date']['input']>;
  message: Scalars['String']['input'];
  type?: InputMaybe<Scalars['String']['input']>;
};


export type MutationCreateDocumentTypeArgs = {
  category?: InputMaybe<Scalars['String']['input']>;
  color?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};


export type MutationCreateEmailTemplateArgs = {
  input: CreateEmailTemplateInput;
};


export type MutationCreateMeasurementUnitArgs = {
  name: Scalars['String']['input'];
};


export type MutationCreateMenuArgs = {
  input: CreateMenuInput;
};


export type MutationCreateNoteTypeArgs = {
  color?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};


export type MutationCreateNotificationEntityArgs = {
  input: CreateNotificationEntityInput;
};


export type MutationCreatePdfTermArgs = {
  input: CreatePdfTermInput;
};


export type MutationCreatePermissionArgs = {
  input: CreatePermissionInput;
};


export type MutationCreateRateOfferArgs = {
  input: CreateRateOfferInput;
};


export type MutationCreateRatePlanArgs = {
  input: CreateRatePlanInput;
};


export type MutationCreateRatesSnapshotArgs = {
  action?: InputMaybe<Scalars['String']['input']>;
  ratePlanUid: Scalars['String']['input'];
};


export type MutationCreateRiskStatusArgs = {
  code: Scalars['String']['input'];
  color?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  manualOffer?: InputMaybe<Scalars['Int']['input']>;
  name: Scalars['String']['input'];
  scoreMax?: InputMaybe<Scalars['Int']['input']>;
  scoreMin?: InputMaybe<Scalars['Int']['input']>;
  sortOrder?: InputMaybe<Scalars['Int']['input']>;
};


export type MutationCreateRoleArgs = {
  input: CreateRoleInput;
};


export type MutationCreateUserArgs = {
  input: CreateUserInput;
};


export type MutationDeleteCustomerNoteArgs = {
  uid: Scalars['String']['input'];
};


export type MutationDeleteDocumentTypeArgs = {
  uid: Scalars['String']['input'];
};


export type MutationDeleteMeasurementUnitArgs = {
  uid: Scalars['String']['input'];
};


export type MutationDeleteNoteTypeArgs = {
  uid: Scalars['String']['input'];
};


export type MutationDeleteNotificationEntityArgs = {
  uid: Scalars['String']['input'];
};


export type MutationDeleteRiskStatusArgs = {
  uid: Scalars['String']['input'];
};


export type MutationGenerateCustomerPdfArgs = {
  customerUid: Scalars['String']['input'];
  signatureImage?: InputMaybe<Scalars['String']['input']>;
  signatureTimestamp?: InputMaybe<Scalars['String']['input']>;
};


export type MutationGenerateVppCertificateArgs = {
  customerUid: Scalars['String']['input'];
  input?: InputMaybe<CustomerVppCertificateDetailsInput>;
};


export type MutationHardDeleteCustomerArgs = {
  uid: Scalars['String']['input'];
};


export type MutationHardDeleteEmailTemplateArgs = {
  uid: Scalars['String']['input'];
};


export type MutationHardDeleteMenuArgs = {
  uid: Scalars['String']['input'];
};


export type MutationHardDeletePermissionArgs = {
  menuUid: Scalars['String']['input'];
  roleUid: Scalars['String']['input'];
};


export type MutationHardDeleteRateOfferArgs = {
  uid: Scalars['String']['input'];
};


export type MutationHardDeleteRatePlanArgs = {
  uid: Scalars['String']['input'];
};


export type MutationHardDeleteRoleArgs = {
  uid: Scalars['String']['input'];
};


export type MutationHardDeleteUserArgs = {
  uid: Scalars['String']['input'];
};


export type MutationLoginArgs = {
  input: LoginInput;
};


export type MutationRefreshTokenArgs = {
  refreshToken: Scalars['String']['input'];
};


export type MutationRegisterArgs = {
  input: RegisterInput;
};


export type MutationRestoreCustomerArgs = {
  uid: Scalars['String']['input'];
};


export type MutationRestoreEmailTemplateArgs = {
  uid: Scalars['String']['input'];
};


export type MutationRestoreMenuArgs = {
  uid: Scalars['String']['input'];
};


export type MutationRestorePdfTermArgs = {
  uid: Scalars['String']['input'];
};


export type MutationRestorePermissionArgs = {
  menuUid: Scalars['String']['input'];
  roleUid: Scalars['String']['input'];
};


export type MutationRestoreRateOfferArgs = {
  uid: Scalars['String']['input'];
};


export type MutationRestoreRatePlanArgs = {
  uid: Scalars['String']['input'];
};


export type MutationRestoreRatesSnapshotArgs = {
  historyUid: Scalars['String']['input'];
};


export type MutationRestoreRoleArgs = {
  uid: Scalars['String']['input'];
};


export type MutationRestoreUserArgs = {
  uid: Scalars['String']['input'];
};


export type MutationSendBulkEmailArgs = {
  attachments?: InputMaybe<Array<EmailAttachmentInput>>;
  bcc?: InputMaybe<Scalars['String']['input']>;
  cc?: InputMaybe<Scalars['String']['input']>;
  customerUids: Array<Scalars['String']['input']>;
  templateUid: Scalars['String']['input'];
};


export type MutationSendCustomerCredentialsEmailArgs = {
  customerUid: Scalars['String']['input'];
  password?: InputMaybe<Scalars['String']['input']>;
};


export type MutationSendOfferEmailArgs = {
  customerUid: Scalars['String']['input'];
};


export type MutationSendReminderEmailArgs = {
  customerUid: Scalars['String']['input'];
  useExistingCode?: InputMaybe<Scalars['Boolean']['input']>;
};


export type MutationSetActiveRatesVersionArgs = {
  uid: Scalars['String']['input'];
};


export type MutationSoftDeleteCustomerArgs = {
  uid: Scalars['String']['input'];
};


export type MutationSoftDeleteEmailTemplateArgs = {
  uid: Scalars['String']['input'];
};


export type MutationSoftDeleteMenuArgs = {
  uid: Scalars['String']['input'];
};


export type MutationSoftDeletePdfTermArgs = {
  uid: Scalars['String']['input'];
};


export type MutationSoftDeletePermissionArgs = {
  menuUid: Scalars['String']['input'];
  roleUid: Scalars['String']['input'];
};


export type MutationSoftDeleteRateOfferArgs = {
  uid: Scalars['String']['input'];
};


export type MutationSoftDeleteRatePlanArgs = {
  uid: Scalars['String']['input'];
};


export type MutationSoftDeleteRoleArgs = {
  uid: Scalars['String']['input'];
};


export type MutationSoftDeleteUserArgs = {
  uid: Scalars['String']['input'];
};


export type MutationUpdateCustomerArgs = {
  input: UpdateCustomerInput;
  uid: Scalars['String']['input'];
};


export type MutationUpdateCustomerNoteArgs = {
  assignedTo?: InputMaybe<Scalars['String']['input']>;
  followUp?: InputMaybe<Scalars['Date']['input']>;
  message?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
  uid: Scalars['String']['input'];
};


export type MutationUpdateDocumentTypeArgs = {
  category?: InputMaybe<Scalars['String']['input']>;
  color?: InputMaybe<Scalars['String']['input']>;
  isActive?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  uid: Scalars['String']['input'];
};


export type MutationUpdateEmailSettingArgs = {
  eventType: Scalars['String']['input'];
  templateUid?: InputMaybe<Scalars['String']['input']>;
};


export type MutationUpdateEmailTemplateArgs = {
  input: UpdateEmailTemplateInput;
  uid: Scalars['String']['input'];
};


export type MutationUpdateMenuArgs = {
  input: UpdateMenuInput;
  uid: Scalars['String']['input'];
};


export type MutationUpdateNoteTypeArgs = {
  color?: InputMaybe<Scalars['String']['input']>;
  isActive?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  uid: Scalars['String']['input'];
};


export type MutationUpdateNotificationEntityArgs = {
  input: UpdateNotificationEntityInput;
  uid: Scalars['String']['input'];
};


export type MutationUpdatePdfTermArgs = {
  input: UpdatePdfTermInput;
  uid: Scalars['String']['input'];
};


export type MutationUpdatePermissionArgs = {
  input: UpdatePermissionInput;
  menuUid: Scalars['String']['input'];
  roleUid: Scalars['String']['input'];
};


export type MutationUpdatePermissionsArgs = {
  input: Array<UpdatePermissionsInput>;
};


export type MutationUpdateRateOfferArgs = {
  input: UpdateRateOfferInput;
  uid: Scalars['String']['input'];
};


export type MutationUpdateRatePlanArgs = {
  input: UpdateRatePlanInput;
  uid: Scalars['String']['input'];
};


export type MutationUpdateRatePlansArgs = {
  inputs: Array<UpdateRatePlanWithUidInput>;
};


export type MutationUpdateRiskStatusArgs = {
  code?: InputMaybe<Scalars['String']['input']>;
  color?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  isActive?: InputMaybe<Scalars['Int']['input']>;
  manualOffer?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  scoreMax?: InputMaybe<Scalars['Int']['input']>;
  scoreMin?: InputMaybe<Scalars['Int']['input']>;
  sortOrder?: InputMaybe<Scalars['Int']['input']>;
  uid: Scalars['String']['input'];
};


export type MutationUpdateRoleArgs = {
  input: UpdateRoleInput;
  uid: Scalars['String']['input'];
};


export type MutationUpdateUserArgs = {
  input: UpdateUserInput;
  uid: Scalars['String']['input'];
};


export type MutationUploadFileArgs = {
  input: UploadFileInput;
};


export type MutationUpsertRoleFeaturePermissionArgs = {
  featureUid: Scalars['String']['input'];
  isEnabled: Scalars['Boolean']['input'];
  roleUid: Scalars['String']['input'];
};


export type MutationUpsertUserFeaturePermissionArgs = {
  input: UpsertUserFeaturePermissionInput;
};


export type MutationUpsertUserPermissionArgs = {
  input: UpsertUserPermissionInput;
};


export type MutationVerifyEmailCodeArgs = {
  customerUid?: InputMaybe<Scalars['String']['input']>;
  verificationCode: Scalars['String']['input'];
};

export type NoteType = {
  __typename?: 'NoteType';
  color?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['Date']['output'];
  createdBy?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  isActive?: Maybe<Scalars['Int']['output']>;
  name: Scalars['String']['output'];
  tenant: Scalars['String']['output'];
  uid: Scalars['String']['output'];
  updatedAt: Scalars['Date']['output'];
  updatedBy?: Maybe<Scalars['String']['output']>;
};

export type NotificationEntity = {
  __typename?: 'NotificationEntity';
  bccEmail?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['Date']['output'];
  createdBy?: Maybe<Scalars['String']['output']>;
  deletedBy?: Maybe<Scalars['String']['output']>;
  entityType: Scalars['Int']['output'];
  fromEmail: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  isActive?: Maybe<Scalars['Int']['output']>;
  isDeleted?: Maybe<Scalars['Int']['output']>;
  preference?: Maybe<Scalars['Int']['output']>;
  tenant: Scalars['String']['output'];
  uid: Scalars['String']['output'];
  updatedAt: Scalars['Date']['output'];
  updatedBy?: Maybe<Scalars['String']['output']>;
  userUids?: Maybe<Array<Scalars['String']['output']>>;
};

export type PageInfo = {
  __typename?: 'PageInfo';
  endCursor?: Maybe<Scalars['String']['output']>;
  hasNextPage: Scalars['Boolean']['output'];
  hasPreviousPage: Scalars['Boolean']['output'];
  startCursor?: Maybe<Scalars['String']['output']>;
  totalCount?: Maybe<Scalars['Int']['output']>;
};

export type PaginatedAuditLogs = {
  __typename?: 'PaginatedAuditLogs';
  data: Array<AuditLog>;
  meta: PaginationMeta;
};

export type PaginatedCustomers = {
  __typename?: 'PaginatedCustomers';
  data: Array<Customer>;
  meta: PaginationMeta;
};

export type PaginatedEmailLogs = {
  __typename?: 'PaginatedEmailLogs';
  data: Array<CustomerEmailLog>;
  meta: PaginationMeta;
};

export type PaginatedEmailTemplates = {
  __typename?: 'PaginatedEmailTemplates';
  data: Array<EmailTemplate>;
  meta: PaginationMeta;
};

export type PaginatedMenus = {
  __typename?: 'PaginatedMenus';
  data: Array<Menu>;
  meta: PaginationMeta;
};

export type PaginatedPdfTerms = {
  __typename?: 'PaginatedPdfTerms';
  data: Array<PdfTerm>;
  meta: PaginationMeta;
};

export type PaginatedPermissions = {
  __typename?: 'PaginatedPermissions';
  data: Array<RoleMenuPermission>;
  meta: PaginationMeta;
};

export type PaginatedRateOffers = {
  __typename?: 'PaginatedRateOffers';
  data: Array<RateOffer>;
  meta: PaginationMeta;
};

export type PaginatedRatePlans = {
  __typename?: 'PaginatedRatePlans';
  data: Array<RatePlan>;
  meta: PaginationMeta;
};

export type PaginatedRatesHistory = {
  __typename?: 'PaginatedRatesHistory';
  data: Array<RatesHistoryRecord>;
  meta: PaginationMeta;
};

export type PaginatedRoles = {
  __typename?: 'PaginatedRoles';
  data: Array<Role>;
  meta: PaginationMeta;
};

export type PaginatedUsers = {
  __typename?: 'PaginatedUsers';
  data: Array<User>;
  meta: PaginationMeta;
};

export type PaginationMeta = {
  __typename?: 'PaginationMeta';
  currentPage: Scalars['Int']['output'];
  recordsPerPage: Scalars['Int']['output'];
  totalPages: Scalars['Int']['output'];
  totalRecords: Scalars['Int']['output'];
};

export type PdfAudit = {
  __typename?: 'PdfAudit';
  /** SHA256 hash of the file */
  sha256: Scalars['String']['output'];
  /** File size in bytes */
  sizeBytes: Scalars['Int']['output'];
};

export type PdfTerm = {
  __typename?: 'PdfTerm';
  content?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['Date']['output'];
  createdBy?: Maybe<Scalars['String']['output']>;
  deletedBy?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  isActive: Scalars['Boolean']['output'];
  isDeleted: Scalars['Boolean']['output'];
  message?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  rateType?: Maybe<Scalars['String']['output']>;
  rateUids?: Maybe<Array<Scalars['String']['output']>>;
  tenant?: Maybe<Scalars['String']['output']>;
  uid: Scalars['String']['output'];
  updatedAt: Scalars['Date']['output'];
  updatedBy?: Maybe<Scalars['String']['output']>;
};

export type PermissionsUpdateResponse = {
  __typename?: 'PermissionsUpdateResponse';
  data?: Maybe<Array<RoleMenuPermission>>;
  message?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
};

export type Query = {
  __typename?: 'Query';
  activeRatesHistory?: Maybe<RatesHistoryRecord>;
  allEmailLogs: PaginatedEmailLogs;
  auditLog?: Maybe<AuditLog>;
  auditLogs: PaginatedAuditLogs;
  checkAddressExists?: Maybe<Customer>;
  checkNmiExists?: Maybe<Customer>;
  customer?: Maybe<Customer>;
  customerByCustomerId?: Maybe<Customer>;
  customerDashboard: CustomerDashboardSummary;
  customerEmailLogs: PaginatedEmailLogs;
  customerNotes: Array<CustomerNote>;
  customers: PaginatedCustomers;
  customersByUids: Array<Customer>;
  customersCursor: CursorPaginatedCustomers;
  documentTypes: Array<DocumentType>;
  emailLogByCode?: Maybe<CustomerEmailLog>;
  emailSettings: Array<EmailSetting>;
  emailTemplate?: Maybe<EmailTemplate>;
  emailTemplates: PaginatedEmailTemplates;
  features: Array<Feature>;
  globalActiveRatesHistory?: Maybe<RatesHistoryRecord>;
  hasRatesChanges: RatesChangesResponse;
  me?: Maybe<User>;
  measurementUnits: Array<MeasurementUnit>;
  menu?: Maybe<Menu>;
  menus: PaginatedMenus;
  noteTypes: Array<NoteType>;
  notificationEntities: Array<NotificationEntity>;
  notificationEntity?: Maybe<NotificationEntity>;
  pdfTerm?: Maybe<PdfTerm>;
  pdfTermsList: PaginatedPdfTerms;
  permission?: Maybe<RoleMenuPermission>;
  previewSystemTemplate: SystemTemplatePreview;
  rateOffer?: Maybe<RateOffer>;
  rateOffers: PaginatedRateOffers;
  ratePlan?: Maybe<RatePlan>;
  ratePlans: PaginatedRatePlans;
  ratesHistory: PaginatedRatesHistory;
  ratesHistoryByVersion?: Maybe<RatesHistoryRecord>;
  ratesHistoryRecord?: Maybe<RatesHistoryRecord>;
  recordAuditHistory: RecordWithAuditHistory;
  riskStatuses: Array<RiskStatus>;
  role?: Maybe<Role>;
  roleFeaturePermissions: Array<RoleFeaturePermission>;
  rolePermissions: PaginatedPermissions;
  roles: PaginatedRoles;
  user?: Maybe<User>;
  userFeaturePermissions: Array<UserFeaturePermission>;
  userPermissions: Array<UserMenuPermission>;
  users: PaginatedUsers;
  validateCustomerAccessCode: Scalars['Boolean']['output'];
};


export type QueryActiveRatesHistoryArgs = {
  ratePlanUid: Scalars['String']['input'];
};


export type QueryAllEmailLogsArgs = {
  emailType?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryAuditLogArgs = {
  uid: Scalars['String']['input'];
};


export type QueryAuditLogsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  recordId?: InputMaybe<Scalars['String']['input']>;
  tableName?: InputMaybe<Scalars['String']['input']>;
};


export type QueryCheckAddressExistsArgs = {
  address: CustomerAddressInput;
};


export type QueryCheckNmiExistsArgs = {
  nmi: Scalars['String']['input'];
};


export type QueryCustomerArgs = {
  uid: Scalars['String']['input'];
};


export type QueryCustomerByCustomerIdArgs = {
  customerId: Scalars['String']['input'];
};


export type QueryCustomerEmailLogsArgs = {
  customerUid: Scalars['String']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryCustomerNotesArgs = {
  customerUid: Scalars['String']['input'];
};


export type QueryCustomersArgs = {
  discount?: InputMaybe<Scalars['Float']['input']>;
  includeDeleted?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryCustomersByUidsArgs = {
  uids: Array<Scalars['String']['input']>;
};


export type QueryCustomersCursorArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  discount?: InputMaybe<Scalars['Float']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  includeDeleted?: InputMaybe<Scalars['String']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  searchAddress?: InputMaybe<Scalars['String']['input']>;
  searchDiscount?: InputMaybe<Scalars['Int']['input']>;
  searchDnsp?: InputMaybe<Scalars['String']['input']>;
  searchId?: InputMaybe<Scalars['String']['input']>;
  searchMobile?: InputMaybe<Scalars['String']['input']>;
  searchMsatConnected?: InputMaybe<Scalars['Int']['input']>;
  searchName?: InputMaybe<Scalars['String']['input']>;
  searchRiskStatus?: InputMaybe<Scalars['String']['input']>;
  searchStatus?: InputMaybe<Scalars['Int']['input']>;
  searchTariff?: InputMaybe<Scalars['String']['input']>;
  searchUtilmateStatus?: InputMaybe<Scalars['Int']['input']>;
  searchVpp?: InputMaybe<Scalars['Int']['input']>;
  searchVppConnected?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryEmailLogByCodeArgs = {
  verificationCode: Scalars['String']['input'];
};


export type QueryEmailTemplateArgs = {
  uid: Scalars['String']['input'];
};


export type QueryEmailTemplatesArgs = {
  entityType?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryFeaturesArgs = {
  menuUid?: InputMaybe<Scalars['String']['input']>;
};


export type QueryMenuArgs = {
  uid: Scalars['String']['input'];
};


export type QueryMenusArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryNotificationEntityArgs = {
  uid: Scalars['String']['input'];
};


export type QueryPdfTermArgs = {
  uid: Scalars['String']['input'];
};


export type QueryPdfTermsListArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryPermissionArgs = {
  menuUid: Scalars['String']['input'];
  roleUid: Scalars['String']['input'];
};


export type QueryPreviewSystemTemplateArgs = {
  eventType: Scalars['String']['input'];
};


export type QueryRateOfferArgs = {
  uid: Scalars['String']['input'];
};


export type QueryRateOffersArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  ratePlanUid: Scalars['String']['input'];
};


export type QueryRatePlanArgs = {
  uid: Scalars['String']['input'];
};


export type QueryRatePlansArgs = {
  dnsp?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  state?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryRatesHistoryArgs = {
  auditAction?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  ratePlanUid?: InputMaybe<Scalars['String']['input']>;
};


export type QueryRatesHistoryByVersionArgs = {
  version: Scalars['String']['input'];
};


export type QueryRatesHistoryRecordArgs = {
  uid: Scalars['String']['input'];
};


export type QueryRecordAuditHistoryArgs = {
  recordId: Scalars['String']['input'];
  tableName: Scalars['String']['input'];
};


export type QueryRoleArgs = {
  uid: Scalars['String']['input'];
};


export type QueryRoleFeaturePermissionsArgs = {
  roleUid: Scalars['String']['input'];
};


export type QueryRolePermissionsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  roleUid: Scalars['String']['input'];
};


export type QueryRolesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryUserArgs = {
  uid: Scalars['String']['input'];
};


export type QueryUserFeaturePermissionsArgs = {
  userUid: Scalars['String']['input'];
};


export type QueryUserPermissionsArgs = {
  userUid: Scalars['String']['input'];
};


export type QueryUsersArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  roleUid?: InputMaybe<Scalars['String']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};


export type QueryValidateCustomerAccessCodeArgs = {
  code: Scalars['String']['input'];
  customerId: Scalars['String']['input'];
};

export type RateOffer = {
  __typename?: 'RateOffer';
  anytime?: Maybe<Scalars['Float']['output']>;
  cl1Supply?: Maybe<Scalars['Float']['output']>;
  cl1Usage?: Maybe<Scalars['Float']['output']>;
  cl2Supply?: Maybe<Scalars['Float']['output']>;
  cl2Usage?: Maybe<Scalars['Float']['output']>;
  createdAt: Scalars['Date']['output'];
  createdBy?: Maybe<Scalars['String']['output']>;
  deletedBy?: Maybe<Scalars['String']['output']>;
  demand?: Maybe<Scalars['Float']['output']>;
  demandOp?: Maybe<Scalars['Float']['output']>;
  demandP?: Maybe<Scalars['Float']['output']>;
  demandS?: Maybe<Scalars['Float']['output']>;
  dynamicRates?: Maybe<Scalars['JSON']['output']>;
  fit?: Maybe<Scalars['Float']['output']>;
  fitCritical?: Maybe<Scalars['Float']['output']>;
  fitPeak?: Maybe<Scalars['Float']['output']>;
  fitVpp?: Maybe<Scalars['Float']['output']>;
  id: Scalars['ID']['output'];
  isActive: Scalars['Boolean']['output'];
  isDeleted: Scalars['Boolean']['output'];
  offPeak?: Maybe<Scalars['Float']['output']>;
  offerName?: Maybe<Scalars['String']['output']>;
  peak?: Maybe<Scalars['Float']['output']>;
  priceUnits?: Maybe<Scalars['JSON']['output']>;
  ratePlanUid: Scalars['String']['output'];
  shoulder?: Maybe<Scalars['Float']['output']>;
  supplyCharge?: Maybe<Scalars['Float']['output']>;
  tenant: Scalars['String']['output'];
  uid: Scalars['String']['output'];
  updatedAt: Scalars['Date']['output'];
  updatedBy?: Maybe<Scalars['String']['output']>;
  vppOrcharge?: Maybe<Scalars['Float']['output']>;
};

export type RateOfferInput = {
  anytime?: InputMaybe<Scalars['Float']['input']>;
  cl1Supply?: InputMaybe<Scalars['Float']['input']>;
  cl1Usage?: InputMaybe<Scalars['Float']['input']>;
  cl2Supply?: InputMaybe<Scalars['Float']['input']>;
  cl2Usage?: InputMaybe<Scalars['Float']['input']>;
  demand?: InputMaybe<Scalars['Float']['input']>;
  demandOp?: InputMaybe<Scalars['Float']['input']>;
  demandP?: InputMaybe<Scalars['Float']['input']>;
  demandS?: InputMaybe<Scalars['Float']['input']>;
  dynamicRates?: InputMaybe<Scalars['JSON']['input']>;
  fit?: InputMaybe<Scalars['Float']['input']>;
  fitCritical?: InputMaybe<Scalars['Float']['input']>;
  fitPeak?: InputMaybe<Scalars['Float']['input']>;
  fitVpp?: InputMaybe<Scalars['Float']['input']>;
  offPeak?: InputMaybe<Scalars['Float']['input']>;
  offerName?: InputMaybe<Scalars['String']['input']>;
  peak?: InputMaybe<Scalars['Float']['input']>;
  priceUnits?: InputMaybe<Scalars['JSON']['input']>;
  shoulder?: InputMaybe<Scalars['Float']['input']>;
  supplyCharge?: InputMaybe<Scalars['Float']['input']>;
  tenant?: InputMaybe<Scalars['String']['input']>;
  uid?: InputMaybe<Scalars['String']['input']>;
  vppOrcharge?: InputMaybe<Scalars['Float']['input']>;
};

export type RatePlan = {
  __typename?: 'RatePlan';
  codes?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['Date']['output'];
  createdBy?: Maybe<Scalars['String']['output']>;
  deletedBy?: Maybe<Scalars['String']['output']>;
  discountApplies?: Maybe<Scalars['Int']['output']>;
  discountPercentage?: Maybe<Scalars['Float']['output']>;
  dnsp?: Maybe<Scalars['Int']['output']>;
  id: Scalars['ID']['output'];
  isActive: Scalars['Boolean']['output'];
  isDeleted: Scalars['Boolean']['output'];
  message?: Maybe<Scalars['String']['output']>;
  offers?: Maybe<Array<RateOffer>>;
  planId?: Maybe<Scalars['String']['output']>;
  state?: Maybe<Scalars['String']['output']>;
  tariff?: Maybe<Scalars['String']['output']>;
  tenant: Scalars['String']['output'];
  type?: Maybe<Scalars['Int']['output']>;
  uid: Scalars['String']['output'];
  updatedAt: Scalars['Date']['output'];
  updatedBy?: Maybe<Scalars['String']['output']>;
  vpp?: Maybe<Scalars['Int']['output']>;
};

export type RatesChangesResponse = {
  __typename?: 'RatesChangesResponse';
  changedRatePlanUids: Array<Scalars['String']['output']>;
  changes: Array<ChangedRatePlan>;
  hasChanges: Scalars['Boolean']['output'];
};

export type RatesHistoryRecord = {
  __typename?: 'RatesHistoryRecord';
  activeVersion?: Maybe<Scalars['Int']['output']>;
  auditAction: Scalars['String']['output'];
  createdAt: Scalars['Date']['output'];
  createdBy?: Maybe<Scalars['String']['output']>;
  createdByName?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  message?: Maybe<Scalars['String']['output']>;
  newRecord?: Maybe<Scalars['String']['output']>;
  oldRecord?: Maybe<Scalars['String']['output']>;
  ratePlanUid: Scalars['String']['output'];
  uid: Scalars['String']['output'];
  version?: Maybe<Scalars['String']['output']>;
};

export type RecordWithAuditHistory = {
  __typename?: 'RecordWithAuditHistory';
  auditHistory: Array<AuditLog>;
  currentRecord?: Maybe<Scalars['String']['output']>;
  recordId: Scalars['String']['output'];
  tableName: Scalars['String']['output'];
};

export type RegisterInput = {
  email: Scalars['String']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  number?: InputMaybe<Scalars['String']['input']>;
  password: Scalars['String']['input'];
  role_uid?: InputMaybe<Scalars['String']['input']>;
  tenant?: InputMaybe<Scalars['String']['input']>;
};

export type RiskStatus = {
  __typename?: 'RiskStatus';
  code: Scalars['String']['output'];
  color?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  isActive: Scalars['Boolean']['output'];
  manualOffer?: Maybe<Scalars['Int']['output']>;
  name: Scalars['String']['output'];
  scoreMax?: Maybe<Scalars['Int']['output']>;
  scoreMin?: Maybe<Scalars['Int']['output']>;
  sortOrder?: Maybe<Scalars['Int']['output']>;
  uid: Scalars['String']['output'];
};

export type Role = {
  __typename?: 'Role';
  createdAt: Scalars['Date']['output'];
  createdBy?: Maybe<Scalars['String']['output']>;
  deletedBy?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  isActive: Scalars['Boolean']['output'];
  isDeleted: Scalars['Boolean']['output'];
  message?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  tenant?: Maybe<Scalars['String']['output']>;
  uid: Scalars['String']['output'];
  updatedAt: Scalars['Date']['output'];
  updatedBy?: Maybe<Scalars['String']['output']>;
};

export type RoleFeaturePermission = {
  __typename?: 'RoleFeaturePermission';
  featureUid: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  isActive: Scalars['Boolean']['output'];
  isEnabled: Scalars['Boolean']['output'];
  roleUid: Scalars['String']['output'];
  tenant?: Maybe<Scalars['String']['output']>;
};

export type RoleMenuPermission = {
  __typename?: 'RoleMenuPermission';
  canCreate: Scalars['Boolean']['output'];
  canDelete: Scalars['Boolean']['output'];
  canEdit: Scalars['Boolean']['output'];
  canView: Scalars['Boolean']['output'];
  createdAt: Scalars['Date']['output'];
  createdBy?: Maybe<Scalars['String']['output']>;
  deletedBy?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  isActive: Scalars['Boolean']['output'];
  isDeleted: Scalars['Boolean']['output'];
  menuUid: Scalars['String']['output'];
  roleUid: Scalars['String']['output'];
  tenant?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['Date']['output'];
  updatedBy?: Maybe<Scalars['String']['output']>;
};

export type SendEmailResult = {
  __typename?: 'SendEmailResult';
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
  verificationCode?: Maybe<Scalars['String']['output']>;
};

export type SummaryCategory = {
  __typename?: 'SummaryCategory';
  count: Scalars['Int']['output'];
  customers: Array<CustomerSummaryItem>;
};

export type SystemTemplatePreview = {
  __typename?: 'SystemTemplatePreview';
  body: Scalars['String']['output'];
  subject: Scalars['String']['output'];
};

export type UpdateCustomerInput = {
  abn?: InputMaybe<Scalars['String']['input']>;
  address?: InputMaybe<CustomerAddressInput>;
  batteryDetails?: InputMaybe<CustomerBatterySystemInput>;
  businessName?: InputMaybe<Scalars['String']['input']>;
  checkCreditScore?: InputMaybe<Scalars['Int']['input']>;
  creditScore?: InputMaybe<Scalars['Int']['input']>;
  debitDetails?: InputMaybe<CustomerDebitDetailsInput>;
  discount?: InputMaybe<Scalars['Float']['input']>;
  dob?: InputMaybe<Scalars['Date']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  emailSent?: InputMaybe<Scalars['Int']['input']>;
  employerName?: InputMaybe<Scalars['String']['input']>;
  enquiryAmount?: InputMaybe<Scalars['Float']['input']>;
  enrollmentDetails?: InputMaybe<CustomerEnrollmentDetailsInput>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  gender?: InputMaybe<Scalars['Int']['input']>;
  identityProof?: InputMaybe<Scalars['String']['input']>;
  isCreditScoreFetched?: InputMaybe<Scalars['Int']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  licenseDocument?: InputMaybe<Scalars['String']['input']>;
  msatDetails?: InputMaybe<CustomerMsatInput>;
  number?: InputMaybe<Scalars['String']['input']>;
  offerEmailSentAt?: InputMaybe<Scalars['Date']['input']>;
  pdfAudit?: InputMaybe<Scalars['String']['input']>;
  phoneVerifiedAt?: InputMaybe<Scalars['Date']['input']>;
  previousBill?: InputMaybe<Scalars['String']['input']>;
  propertyType?: InputMaybe<Scalars['Int']['input']>;
  rateVersion?: InputMaybe<Scalars['String']['input']>;
  relationshipStatus?: InputMaybe<Scalars['Int']['input']>;
  riskStatus?: InputMaybe<Scalars['String']['input']>;
  showAsBusinessName?: InputMaybe<Scalars['Boolean']['input']>;
  showName?: InputMaybe<Scalars['Boolean']['input']>;
  signDate?: InputMaybe<Scalars['Date']['input']>;
  signatureBase64?: InputMaybe<Scalars['String']['input']>;
  signatureUrl?: InputMaybe<Scalars['String']['input']>;
  signedPdfPath?: InputMaybe<Scalars['String']['input']>;
  skipStatusUpdate?: InputMaybe<Scalars['Boolean']['input']>;
  solarDetails?: InputMaybe<CustomerSolarSystemInput>;
  status?: InputMaybe<Scalars['Int']['input']>;
  tariffCode?: InputMaybe<Scalars['String']['input']>;
  triggerUpdateEmail?: InputMaybe<Scalars['Boolean']['input']>;
  triggerWelcomeEmail?: InputMaybe<Scalars['Boolean']['input']>;
  utilmateDetails?: InputMaybe<CustomerUtilmateInput>;
  utilmateStatus?: InputMaybe<Scalars['Int']['input']>;
  utilmateUploadedManually?: InputMaybe<Scalars['Int']['input']>;
  vppCertificateDetails?: InputMaybe<CustomerVppCertificateDetailsInput>;
  vppDetails?: InputMaybe<CustomerVppInput>;
};

export type UpdateEmailTemplateInput = {
  body?: InputMaybe<Scalars['String']['input']>;
  entityType?: InputMaybe<Scalars['Int']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['Int']['input']>;
  subject?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateMenuInput = {
  code?: InputMaybe<Scalars['String']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  parentUid?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateNotificationEntityInput = {
  bccEmail?: InputMaybe<Scalars['String']['input']>;
  entityType?: InputMaybe<Scalars['Int']['input']>;
  fromEmail?: InputMaybe<Scalars['String']['input']>;
  isActive?: InputMaybe<Scalars['Int']['input']>;
  password?: InputMaybe<Scalars['String']['input']>;
  preference?: InputMaybe<Scalars['Int']['input']>;
  userUids?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type UpdatePdfTermInput = {
  content?: InputMaybe<Scalars['String']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  rateType?: InputMaybe<Scalars['String']['input']>;
  rateUids?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type UpdatePermissionInput = {
  canCreate?: InputMaybe<Scalars['Boolean']['input']>;
  canDelete?: InputMaybe<Scalars['Boolean']['input']>;
  canEdit?: InputMaybe<Scalars['Boolean']['input']>;
  canView?: InputMaybe<Scalars['Boolean']['input']>;
};

export type UpdatePermissionsInput = {
  canCreate?: InputMaybe<Scalars['Boolean']['input']>;
  canDelete?: InputMaybe<Scalars['Boolean']['input']>;
  canEdit?: InputMaybe<Scalars['Boolean']['input']>;
  canView?: InputMaybe<Scalars['Boolean']['input']>;
  menuUid: Scalars['String']['input'];
  roleUid: Scalars['String']['input'];
};

export type UpdateRateOfferInput = {
  anytime?: InputMaybe<Scalars['Float']['input']>;
  cl1Supply?: InputMaybe<Scalars['Float']['input']>;
  cl1Usage?: InputMaybe<Scalars['Float']['input']>;
  cl2Supply?: InputMaybe<Scalars['Float']['input']>;
  cl2Usage?: InputMaybe<Scalars['Float']['input']>;
  demand?: InputMaybe<Scalars['Float']['input']>;
  demandOp?: InputMaybe<Scalars['Float']['input']>;
  demandP?: InputMaybe<Scalars['Float']['input']>;
  demandS?: InputMaybe<Scalars['Float']['input']>;
  fit?: InputMaybe<Scalars['Float']['input']>;
  fitCritical?: InputMaybe<Scalars['Float']['input']>;
  fitPeak?: InputMaybe<Scalars['Float']['input']>;
  fitVpp?: InputMaybe<Scalars['Float']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  offPeak?: InputMaybe<Scalars['Float']['input']>;
  offerName?: InputMaybe<Scalars['String']['input']>;
  peak?: InputMaybe<Scalars['Float']['input']>;
  priceUnits?: InputMaybe<Scalars['JSON']['input']>;
  shoulder?: InputMaybe<Scalars['Float']['input']>;
  supplyCharge?: InputMaybe<Scalars['Float']['input']>;
  vppOrcharge?: InputMaybe<Scalars['Float']['input']>;
};

export type UpdateRatePlanInput = {
  codes?: InputMaybe<Scalars['String']['input']>;
  discountApplies?: InputMaybe<Scalars['Int']['input']>;
  discountPercentage?: InputMaybe<Scalars['Float']['input']>;
  dnsp?: InputMaybe<Scalars['Int']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  offers?: InputMaybe<Array<RateOfferInput>>;
  planId?: InputMaybe<Scalars['String']['input']>;
  state?: InputMaybe<Scalars['String']['input']>;
  tariff?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['Int']['input']>;
  vpp?: InputMaybe<Scalars['Int']['input']>;
};

export type UpdateRatePlanWithUidInput = {
  data: UpdateRatePlanInput;
  uid: Scalars['String']['input'];
};

export type UpdateRoleInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateUserInput = {
  name?: InputMaybe<Scalars['String']['input']>;
  number?: InputMaybe<Scalars['String']['input']>;
  password?: InputMaybe<Scalars['String']['input']>;
  role_uid?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['Int']['input']>;
};

export type UploadFileInput = {
  /** Optional: Associate with a customer UID */
  customerUid?: InputMaybe<Scalars['String']['input']>;
  /** Optional: Document type (e.g., 'signed_pdf', 'contract') */
  documentType?: InputMaybe<Scalars['String']['input']>;
  /** Base64 encoded file content */
  fileContent: Scalars['String']['input'];
  /** Original filename with extension */
  filename: Scalars['String']['input'];
  /** Folder to store the file in (e.g., 'pdfs', 'documents') */
  folder?: InputMaybe<Scalars['String']['input']>;
};

export type UploadFileResult = {
  __typename?: 'UploadFileResult';
  /** MIME type */
  contentType: Scalars['String']['output'];
  /** Original filename */
  filename: Scalars['String']['output'];
  /** Storage path/key of the file */
  path: Scalars['String']['output'];
  /** PDF audit information (hash and size) */
  pdfAudit: PdfAudit;
  /** File size in bytes */
  size: Scalars['Int']['output'];
  /** Public URL of the uploaded file */
  url: Scalars['String']['output'];
};

export type UpsertUserFeaturePermissionInput = {
  featureUid: Scalars['String']['input'];
  isEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  userUid: Scalars['String']['input'];
};

export type UpsertUserPermissionInput = {
  canCreate?: InputMaybe<Scalars['Boolean']['input']>;
  canDelete?: InputMaybe<Scalars['Boolean']['input']>;
  canEdit?: InputMaybe<Scalars['Boolean']['input']>;
  canView?: InputMaybe<Scalars['Boolean']['input']>;
  menuUid: Scalars['String']['input'];
  userUid: Scalars['String']['input'];
};

export type User = {
  __typename?: 'User';
  accessibleFeatures?: Maybe<Array<AccessibleFeature>>;
  accessibleMenus?: Maybe<Array<AccessibleMenu>>;
  createdAt: Scalars['Date']['output'];
  createdBy?: Maybe<Scalars['String']['output']>;
  deletedBy?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  isActive: Scalars['Boolean']['output'];
  isDeleted: Scalars['Boolean']['output'];
  message?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  number?: Maybe<Scalars['String']['output']>;
  password?: Maybe<Scalars['String']['output']>;
  roleName?: Maybe<Scalars['String']['output']>;
  roleUid?: Maybe<Scalars['String']['output']>;
  status: UserStatus;
  tenant: Scalars['String']['output'];
  uid: Scalars['String']['output'];
  updatedAt: Scalars['Date']['output'];
  updatedBy?: Maybe<Scalars['String']['output']>;
};

export type UserFeaturePermission = {
  __typename?: 'UserFeaturePermission';
  featureUid: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  isEnabled?: Maybe<Scalars['Boolean']['output']>;
  userUid: Scalars['String']['output'];
};

export type UserMenuPermission = {
  __typename?: 'UserMenuPermission';
  canCreate?: Maybe<Scalars['Boolean']['output']>;
  canDelete?: Maybe<Scalars['Boolean']['output']>;
  canEdit?: Maybe<Scalars['Boolean']['output']>;
  canView?: Maybe<Scalars['Boolean']['output']>;
  id: Scalars['ID']['output'];
  menuUid: Scalars['String']['output'];
  userUid: Scalars['String']['output'];
};

export type UserOperationResponse = {
  __typename?: 'UserOperationResponse';
  message?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
};

export type UserStatus =
  | 'ACTIVE'
  | 'DISABLED'
  | 'INACTIVE';

export type CustomerBasicFieldsFragment = { __typename?: 'Customer', uid: string, customerId?: string | null, firstName?: string | null, lastName?: string | null, email?: string | null, number?: string | null, status?: number | null, createdAt: any, updatedAt: any } & { ' $fragmentName'?: 'CustomerBasicFieldsFragment' };

export type CustomerAddressFieldsFragment = { __typename?: 'CustomerAddress', id: string, streetName?: string | null, suburb?: string | null, state?: string | null, postcode?: string | null, country?: string | null } & { ' $fragmentName'?: 'CustomerAddressFieldsFragment' };

export type UserFieldsFragment = { __typename?: 'User', uid: string, email?: string | null, password?: string | null, name?: string | null, number?: string | null, tenant: string, roleUid?: string | null, roleName?: string | null, status: UserStatus, isActive: boolean, isDeleted: boolean, createdAt: any, message?: string | null } & { ' $fragmentName'?: 'UserFieldsFragment' };

export type RatePlanFieldsFragment = { __typename?: 'RatePlan', uid: string, tenant: string, codes?: string | null, planId?: string | null, dnsp?: number | null, state?: string | null, tariff?: string | null, type?: number | null, vpp?: number | null, discountApplies?: number | null, discountPercentage?: number | null, isActive: boolean, isDeleted: boolean, createdAt: any, updatedAt: any, createdBy?: string | null, updatedBy?: string | null, message?: string | null } & { ' $fragmentName'?: 'RatePlanFieldsFragment' };

export type RateOfferFieldsFragment = { __typename?: 'RateOffer', uid: string, ratePlanUid: string, tenant: string, offerName?: string | null, anytime?: number | null, cl1Supply?: number | null, cl1Usage?: number | null, cl2Supply?: number | null, cl2Usage?: number | null, demand?: number | null, demandOp?: number | null, demandP?: number | null, demandS?: number | null, fit?: number | null, fitPeak?: number | null, fitCritical?: number | null, fitVpp?: number | null, offPeak?: number | null, peak?: number | null, shoulder?: number | null, supplyCharge?: number | null, vppOrcharge?: number | null, dynamicRates?: Record<string, unknown> | null, priceUnits?: Record<string, unknown> | null, isActive: boolean, isDeleted: boolean, createdAt: any, updatedAt: any, createdBy?: string | null, updatedBy?: string | null } & { ' $fragmentName'?: 'RateOfferFieldsFragment' };

export type LoginMutationVariables = Exact<{
  input: LoginInput;
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'AuthTokens', accessToken: string, refreshToken: string, message?: string | null } };

export type RefreshTokenMutationVariables = Exact<{
  refreshToken: Scalars['String']['input'];
}>;


export type RefreshTokenMutation = { __typename?: 'Mutation', refreshToken: { __typename?: 'AuthTokens', accessToken: string, refreshToken: string } };

export type CreateDocumentTypeMutationVariables = Exact<{
  name: Scalars['String']['input'];
  color?: InputMaybe<Scalars['String']['input']>;
  category?: InputMaybe<Scalars['String']['input']>;
}>;


export type CreateDocumentTypeMutation = { __typename?: 'Mutation', createDocumentType: { __typename?: 'DocumentType', uid: string, name: string, color?: string | null, category?: string | null, isActive?: number | null } };

export type UpdateDocumentTypeMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  color?: InputMaybe<Scalars['String']['input']>;
  category?: InputMaybe<Scalars['String']['input']>;
  isActive?: InputMaybe<Scalars['Int']['input']>;
}>;


export type UpdateDocumentTypeMutation = { __typename?: 'Mutation', updateDocumentType: { __typename?: 'DocumentType', uid: string, name: string, color?: string | null, category?: string | null, isActive?: number | null } };

export type DeleteDocumentTypeMutationVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type DeleteDocumentTypeMutation = { __typename?: 'Mutation', deleteDocumentType: boolean };

export type CreateEmailTemplateMutationVariables = Exact<{
  input: CreateEmailTemplateInput;
}>;


export type CreateEmailTemplateMutation = { __typename?: 'Mutation', createEmailTemplate: { __typename?: 'EmailTemplate', id: string, uid: string, name: string, message?: string | null } };

export type UpdateEmailTemplateMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  input: UpdateEmailTemplateInput;
}>;


export type UpdateEmailTemplateMutation = { __typename?: 'Mutation', updateEmailTemplate: { __typename?: 'EmailTemplate', id: string, uid: string, name: string, message?: string | null } };

export type SoftDeleteEmailTemplateMutationVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type SoftDeleteEmailTemplateMutation = { __typename?: 'Mutation', softDeleteEmailTemplate: boolean };

export type RestoreEmailTemplateMutationVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type RestoreEmailTemplateMutation = { __typename?: 'Mutation', restoreEmailTemplate: boolean };

export type SendBulkEmailMutationVariables = Exact<{
  templateUid: Scalars['String']['input'];
  customerUids: Array<Scalars['String']['input']> | Scalars['String']['input'];
  cc?: InputMaybe<Scalars['String']['input']>;
  bcc?: InputMaybe<Scalars['String']['input']>;
  attachments?: InputMaybe<Array<EmailAttachmentInput> | EmailAttachmentInput>;
}>;


export type SendBulkEmailMutation = { __typename?: 'Mutation', sendBulkEmail: { __typename?: 'BulkEmailResult', success: boolean, message?: string | null, sentCount?: number | null, failedCount?: number | null } };

export type CreateCustomerNoteMutationVariables = Exact<{
  customerUid: Scalars['String']['input'];
  message: Scalars['String']['input'];
  followUp?: InputMaybe<Scalars['Date']['input']>;
  assignedTo?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
}>;


export type CreateCustomerNoteMutation = { __typename?: 'Mutation', createCustomerNote: { __typename?: 'CustomerNote', id: string, uid: string, customerUid: string, message: string, followUp?: any | null, assignedTo?: string | null, type?: string | null, createdAt: any, createdBy?: string | null, createdByName?: string | null, assignedToUser?: { __typename?: 'User', uid: string, name?: string | null } | null, noteTypeDetails?: { __typename?: 'NoteType', uid: string, name: string, color?: string | null } | null } };

export type DeleteCustomerNoteMutationVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type DeleteCustomerNoteMutation = { __typename?: 'Mutation', deleteCustomerNote: boolean };

export type CreateNoteTypeMutationVariables = Exact<{
  name: Scalars['String']['input'];
  color?: InputMaybe<Scalars['String']['input']>;
}>;


export type CreateNoteTypeMutation = { __typename?: 'Mutation', createNoteType: { __typename?: 'NoteType', uid: string, name: string, color?: string | null, isActive?: number | null, createdAt: any, createdBy?: string | null } };

export type DeleteNoteTypeMutationVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type DeleteNoteTypeMutation = { __typename?: 'Mutation', deleteNoteType: boolean };

export type UpdateNoteTypeMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  color?: InputMaybe<Scalars['String']['input']>;
  isActive?: InputMaybe<Scalars['Int']['input']>;
}>;


export type UpdateNoteTypeMutation = { __typename?: 'Mutation', updateNoteType: { __typename?: 'NoteType', uid: string, name: string, color?: string | null, isActive?: number | null, updatedAt: any } };

export type CreateNotificationEntityMutationVariables = Exact<{
  input: CreateNotificationEntityInput;
}>;


export type CreateNotificationEntityMutation = { __typename?: 'Mutation', createNotificationEntity: { __typename?: 'NotificationEntity', id: string, uid: string, fromEmail: string, isActive?: number | null, userUids?: Array<string> | null } };

export type UpdateNotificationEntityMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  input: UpdateNotificationEntityInput;
}>;


export type UpdateNotificationEntityMutation = { __typename?: 'Mutation', updateNotificationEntity: { __typename?: 'NotificationEntity', id: string, uid: string, fromEmail: string, isActive?: number | null, userUids?: Array<string> | null } };

export type DeleteNotificationEntityMutationVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type DeleteNotificationEntityMutation = { __typename?: 'Mutation', deleteNotificationEntity: boolean };

export type CreatePdfTermMutationVariables = Exact<{
  input: CreatePdfTermInput;
}>;


export type CreatePdfTermMutation = { __typename?: 'Mutation', createPdfTerm: { __typename?: 'PdfTerm', id: string, uid: string, name: string, rateType?: string | null, rateUids?: Array<string> | null, message?: string | null } };

export type UpdatePdfTermMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  input: UpdatePdfTermInput;
}>;


export type UpdatePdfTermMutation = { __typename?: 'Mutation', updatePdfTerm: { __typename?: 'PdfTerm', id: string, uid: string, name: string, rateType?: string | null, rateUids?: Array<string> | null, message?: string | null } };

export type SoftDeletePdfTermMutationVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type SoftDeletePdfTermMutation = { __typename?: 'Mutation', softDeletePdfTerm: boolean };

export type RestorePdfTermMutationVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type RestorePdfTermMutation = { __typename?: 'Mutation', restorePdfTerm: boolean };

export type UpdatePermissionMutationVariables = Exact<{
  roleUid: Scalars['String']['input'];
  menuUid: Scalars['String']['input'];
  input: UpdatePermissionInput;
}>;


export type UpdatePermissionMutation = { __typename?: 'Mutation', updatePermission: { __typename?: 'RoleMenuPermission', id: string, roleUid: string, menuUid: string, canView: boolean, canCreate: boolean, canEdit: boolean, canDelete: boolean } };

export type UpdatePermissionsMutationVariables = Exact<{
  input: Array<UpdatePermissionsInput> | UpdatePermissionsInput;
}>;


export type UpdatePermissionsMutation = { __typename?: 'Mutation', updatePermissions: { __typename?: 'PermissionsUpdateResponse', success: boolean, message?: string | null, data?: Array<{ __typename?: 'RoleMenuPermission', roleUid: string, menuUid: string, canView: boolean, canCreate: boolean, canEdit: boolean, canDelete: boolean }> | null } };

export type UpsertRoleFeaturePermissionMutationVariables = Exact<{
  roleUid: Scalars['String']['input'];
  featureUid: Scalars['String']['input'];
  isEnabled: Scalars['Boolean']['input'];
}>;


export type UpsertRoleFeaturePermissionMutation = { __typename?: 'Mutation', upsertRoleFeaturePermission: { __typename?: 'RoleFeaturePermission', id: string, roleUid: string, featureUid: string, isEnabled: boolean } };

export type CreateRatePlanMutationVariables = Exact<{
  input: CreateRatePlanInput;
}>;


export type CreateRatePlanMutation = { __typename?: 'Mutation', createRatePlan: (
    { __typename?: 'RatePlan' }
    & { ' $fragmentRefs'?: { 'RatePlanFieldsFragment': RatePlanFieldsFragment } }
  ) };

export type UpdateRatePlanMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  input: UpdateRatePlanInput;
}>;


export type UpdateRatePlanMutation = { __typename?: 'Mutation', updateRatePlan: (
    { __typename?: 'RatePlan' }
    & { ' $fragmentRefs'?: { 'RatePlanFieldsFragment': RatePlanFieldsFragment } }
  ) };

export type DeleteRatePlanMutationVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type DeleteRatePlanMutation = { __typename?: 'Mutation', hardDeleteRatePlan: boolean };

export type SoftDeleteRatePlanMutationVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type SoftDeleteRatePlanMutation = { __typename?: 'Mutation', softDeleteRatePlan: boolean };

export type RestoreRatePlanMutationVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type RestoreRatePlanMutation = { __typename?: 'Mutation', restoreRatePlan: boolean };

export type CreateRateOfferMutationVariables = Exact<{
  input: CreateRateOfferInput;
}>;


export type CreateRateOfferMutation = { __typename?: 'Mutation', createRateOffer: (
    { __typename?: 'RateOffer' }
    & { ' $fragmentRefs'?: { 'RateOfferFieldsFragment': RateOfferFieldsFragment } }
  ) };

export type UpdateRateOfferMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  input: UpdateRateOfferInput;
}>;


export type UpdateRateOfferMutation = { __typename?: 'Mutation', updateRateOffer: (
    { __typename?: 'RateOffer' }
    & { ' $fragmentRefs'?: { 'RateOfferFieldsFragment': RateOfferFieldsFragment } }
  ) };

export type DeleteRateOfferMutationVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type DeleteRateOfferMutation = { __typename?: 'Mutation', hardDeleteRateOffer: boolean };

export type CreateRatesSnapshotMutationVariables = Exact<{
  ratePlanUid: Scalars['String']['input'];
  action?: InputMaybe<Scalars['String']['input']>;
}>;


export type CreateRatesSnapshotMutation = { __typename?: 'Mutation', createRatesSnapshot: { __typename?: 'RatesHistoryRecord', id: string, uid: string, ratePlanUid: string, auditAction: string, createdAt: any, createdBy?: string | null, createdByName?: string | null, message?: string | null } };

export type SetActiveRatesVersionMutationVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type SetActiveRatesVersionMutation = { __typename?: 'Mutation', setActiveRatesVersion: { __typename?: 'RatesHistoryRecord', uid: string, version?: string | null, activeVersion?: number | null, createdAt: any, createdByName?: string | null, message?: string | null } };

export type RestoreRatesSnapshotMutationVariables = Exact<{
  historyUid: Scalars['String']['input'];
}>;


export type RestoreRatesSnapshotMutation = { __typename?: 'Mutation', restoreRatesSnapshot: boolean };

export type UpdateRatePlansMutationVariables = Exact<{
  inputs: Array<UpdateRatePlanWithUidInput> | UpdateRatePlanWithUidInput;
}>;


export type UpdateRatePlansMutation = { __typename?: 'Mutation', updateRatePlans: Array<(
    { __typename?: 'RatePlan' }
    & { ' $fragmentRefs'?: { 'RatePlanFieldsFragment': RatePlanFieldsFragment } }
  )> };

export type CreateMeasurementUnitMutationVariables = Exact<{
  name: Scalars['String']['input'];
}>;


export type CreateMeasurementUnitMutation = { __typename?: 'Mutation', createMeasurementUnit: { __typename?: 'MeasurementUnit', id: string, uid: string, name: string } };

export type DeleteMeasurementUnitMutationVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type DeleteMeasurementUnitMutation = { __typename?: 'Mutation', deleteMeasurementUnit: boolean };

export type CreateRiskStatusMutationVariables = Exact<{
  name: Scalars['String']['input'];
  code: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  color?: InputMaybe<Scalars['String']['input']>;
  scoreMin?: InputMaybe<Scalars['Int']['input']>;
  scoreMax?: InputMaybe<Scalars['Int']['input']>;
  manualOffer?: InputMaybe<Scalars['Int']['input']>;
  sortOrder?: InputMaybe<Scalars['Int']['input']>;
}>;


export type CreateRiskStatusMutation = { __typename?: 'Mutation', createRiskStatus: { __typename?: 'RiskStatus', uid: string, name: string, code: string, description?: string | null, color?: string | null, scoreMin?: number | null, scoreMax?: number | null, manualOffer?: number | null, sortOrder?: number | null, isActive: boolean } };

export type UpdateRiskStatusMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  code?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  color?: InputMaybe<Scalars['String']['input']>;
  scoreMin?: InputMaybe<Scalars['Int']['input']>;
  scoreMax?: InputMaybe<Scalars['Int']['input']>;
  manualOffer?: InputMaybe<Scalars['Int']['input']>;
  sortOrder?: InputMaybe<Scalars['Int']['input']>;
  isActive?: InputMaybe<Scalars['Int']['input']>;
}>;


export type UpdateRiskStatusMutation = { __typename?: 'Mutation', updateRiskStatus: { __typename?: 'RiskStatus', uid: string, name: string, code: string, description?: string | null, color?: string | null, scoreMin?: number | null, scoreMax?: number | null, manualOffer?: number | null, sortOrder?: number | null, isActive: boolean } };

export type DeleteRiskStatusMutationVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type DeleteRiskStatusMutation = { __typename?: 'Mutation', deleteRiskStatus: boolean };

export type CreateRoleMutationVariables = Exact<{
  input: CreateRoleInput;
}>;


export type CreateRoleMutation = { __typename?: 'Mutation', createRole: { __typename?: 'Role', uid: string, name: string, description?: string | null, isActive: boolean, message?: string | null } };

export type UpdateRoleMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  input: UpdateRoleInput;
}>;


export type UpdateRoleMutation = { __typename?: 'Mutation', updateRole: { __typename?: 'Role', uid: string, name: string, description?: string | null, isActive: boolean, message?: string | null } };

export type SoftDeleteRoleMutationVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type SoftDeleteRoleMutation = { __typename?: 'Mutation', softDeleteRole: boolean };

export type RestoreRoleMutationVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type RestoreRoleMutation = { __typename?: 'Mutation', restoreRole: boolean };

export type UpsertUserPermissionMutationVariables = Exact<{
  input: UpsertUserPermissionInput;
}>;


export type UpsertUserPermissionMutation = { __typename?: 'Mutation', upsertUserPermission: { __typename?: 'UserMenuPermission', id: string, userUid: string, menuUid: string, canView?: boolean | null, canCreate?: boolean | null, canEdit?: boolean | null, canDelete?: boolean | null } };

export type UpsertUserFeaturePermissionMutationVariables = Exact<{
  input: UpsertUserFeaturePermissionInput;
}>;


export type UpsertUserFeaturePermissionMutation = { __typename?: 'Mutation', upsertUserFeaturePermission: { __typename?: 'UserFeaturePermission', id: string, userUid: string, featureUid: string, isEnabled?: boolean | null } };

export type CreateUserMutationVariables = Exact<{
  input: CreateUserInput;
}>;


export type CreateUserMutation = { __typename?: 'Mutation', createUser: (
    { __typename?: 'User' }
    & { ' $fragmentRefs'?: { 'UserFieldsFragment': UserFieldsFragment } }
  ) };

export type UpdateUserMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  input: UpdateUserInput;
}>;


export type UpdateUserMutation = { __typename?: 'Mutation', updateUser: (
    { __typename?: 'User' }
    & { ' $fragmentRefs'?: { 'UserFieldsFragment': UserFieldsFragment } }
  ) };

export type SoftDeleteUserMutationVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type SoftDeleteUserMutation = { __typename?: 'Mutation', softDeleteUser: { __typename?: 'UserOperationResponse', success: boolean, message?: string | null } };

export type RestoreUserMutationVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type RestoreUserMutation = { __typename?: 'Mutation', restoreUser: { __typename?: 'UserOperationResponse', success: boolean, message?: string | null } };

export type ChangePasswordMutationVariables = Exact<{
  input: ChangePasswordInput;
}>;


export type ChangePasswordMutation = { __typename?: 'Mutation', changePassword: boolean };

export type AuditLogsQueryVariables = Exact<{
  page?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  tableName?: InputMaybe<Scalars['String']['input']>;
  recordId?: InputMaybe<Scalars['String']['input']>;
}>;


export type AuditLogsQuery = { __typename?: 'Query', auditLogs: { __typename?: 'PaginatedAuditLogs', meta: { __typename?: 'PaginationMeta', totalRecords: number, currentPage: number, totalPages: number, recordsPerPage: number }, data: Array<{ __typename?: 'AuditLog', id: string, uid: string, tableName: string, recordId?: string | null, operation: string, oldValues?: string | null, newValues?: string | null, changedAt: any, changedBy?: string | null }> } };

export type AuditLogQueryVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type AuditLogQuery = { __typename?: 'Query', auditLog?: { __typename?: 'AuditLog', id: string, uid: string, tableName: string, recordId?: string | null, operation: string, oldValues?: string | null, newValues?: string | null, changedAt: any, changedBy?: string | null } | null };

export type RecordAuditHistoryQueryVariables = Exact<{
  tableName: Scalars['String']['input'];
  recordId: Scalars['String']['input'];
}>;


export type RecordAuditHistoryQuery = { __typename?: 'Query', recordAuditHistory: { __typename?: 'RecordWithAuditHistory', tableName: string, recordId: string, currentRecord?: string | null, auditHistory: Array<{ __typename?: 'AuditLog', id: string, uid: string, operation: string, oldValues?: string | null, newValues?: string | null, changedAt: any, changedBy?: string | null }> } };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me?: { __typename?: 'User', id: string, uid: string, email?: string | null, name?: string | null, number?: string | null, tenant: string, roleUid?: string | null, roleName?: string | null, status: UserStatus, isActive: boolean, isDeleted: boolean, createdAt: any, accessibleMenus?: Array<{ __typename?: 'AccessibleMenu', menuUid: string, menuName: string, menuCode: string, parentUid?: string | null, canView: boolean, canCreate: boolean, canEdit: boolean, canDelete: boolean, sortOrder?: number | null }> | null, accessibleFeatures?: Array<{ __typename?: 'AccessibleFeature', featureUid: string, featureCode: string, featureName: string, isEnabled: boolean }> | null } | null };

export type CustomersQueryVariables = Exact<{
  page?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type CustomersQuery = { __typename?: 'Query', customers: { __typename?: 'PaginatedCustomers', data: Array<{ __typename?: 'Customer', id: string, uid: string, customerId?: string | null, tenant: string, email?: string | null, firstName?: string | null, lastName?: string | null, businessName?: string | null, abn?: string | null, number?: string | null, dob?: any | null, phoneVerifiedAt?: any | null, propertyType?: number | null, tariffCode?: string | null, status?: number | null, utilmateStatus?: number | null, utilmateUpdatedAt?: any | null, utilmateUploadedManually?: number | null, gender?: number | null, relationshipStatus?: number | null, enquiryAmount?: number | null, checkCreditScore?: number | null, employerName?: string | null, riskStatus?: string | null, signDate?: any | null, signedPdfPath?: string | null, pdfAudit?: string | null, emailSent?: number | null, discount?: number | null, previousCustomerUid?: string | null, isActive: boolean, isDeleted: boolean, createdAt: any, offerEmailSentAt?: any | null, updatedAt: any, createdBy?: string | null, updatedBy?: string | null, deletedBy?: string | null, previousBill?: { __typename?: 'CustomerDocument', id: string, filename?: string | null, path?: string | null, size?: number | null, mimeType?: string | null, createdAt: any, createdBy?: string | null, createdByUser?: { __typename?: 'User', name?: string | null } | null } | null, identityProof?: { __typename?: 'CustomerDocument', id: string, filename?: string | null, path?: string | null, size?: number | null, mimeType?: string | null, createdAt: any, createdBy?: string | null, createdByUser?: { __typename?: 'User', name?: string | null } | null } | null, ratePlan?: { __typename?: 'RatePlan', id: string, uid: string, tenant: string, codes?: string | null, planId?: string | null, dnsp?: number | null, state?: string | null, tariff?: string | null, type?: number | null, vpp?: number | null, discountApplies?: number | null, discountPercentage?: number | null, isActive: boolean, isDeleted: boolean, createdAt: any, updatedAt: any, createdBy?: string | null, updatedBy?: string | null, deletedBy?: string | null, offers?: Array<{ __typename?: 'RateOffer', id: string, uid: string, ratePlanUid: string, tenant: string, offerName?: string | null, anytime?: number | null, cl1Supply?: number | null, cl1Usage?: number | null, cl2Supply?: number | null, cl2Usage?: number | null, demand?: number | null, demandOp?: number | null, demandP?: number | null, demandS?: number | null, fit?: number | null, fitPeak?: number | null, fitCritical?: number | null, fitVpp?: number | null, offPeak?: number | null, peak?: number | null, shoulder?: number | null, supplyCharge?: number | null, vppOrcharge?: number | null, dynamicRates?: Record<string, unknown> | null, priceUnits?: Record<string, unknown> | null, isActive: boolean, isDeleted: boolean, createdAt: any, updatedAt: any, createdBy?: string | null, updatedBy?: string | null, deletedBy?: string | null }> | null } | null, enrollmentDetails?: { __typename?: 'CustomerEnrollmentDetails', id: string, customerUid: string, saletype?: number | null, connectiondate?: any | null, idtype?: number | null, idnumber?: string | null, idstate?: string | null, idcountry?: string | null, idexpiry?: any | null, concession?: number | null, lifesupport?: number | null, billingpreference?: number | null, isActive: boolean, isDeleted: boolean, createdAt: any, updatedAt: any } | null, address?: { __typename?: 'CustomerAddress', id: string, customerUid: string, unitNumber?: string | null, streetNumber?: string | null, streetName?: string | null, streetType?: string | null, suburb?: string | null, state?: string | null, postcode?: string | null, country?: string | null, nmi?: string | null, isActive: boolean, isDeleted: boolean, createdAt: any, updatedAt: any } | null, solarDetails?: { __typename?: 'CustomerSolarSystem', id: string, customerUid: string, hassolar?: number | null, solarcapacity?: number | null, invertercapacity?: number | null, isActive: boolean, isDeleted: boolean, createdAt: any, updatedAt: any } | null, batteryDetails?: { __typename?: 'CustomerBatterySystem', id: string, customerUid: string, batterybrand?: string | null, snnumber?: string | null, batterycapacity?: number | null, exportlimit?: number | null, inverterCapacity?: number | null, checkCode?: string | null, isActive: boolean, isDeleted: boolean, createdAt: any, updatedAt: any } | null, msatDetails?: { __typename?: 'CustomerMsat', id: string, customerUid: string, msatConnected?: number | null, msatConnectedAt?: any | null, msatUpdatedAt?: any | null, isActive: boolean, isDeleted: boolean, createdAt: any, updatedAt: any } | null, vppDetails?: { __typename?: 'CustomerVpp', id: string, customerUid: string, vpp?: number | null, vppConnected?: number | null, vppSignupBonus?: number | null, isActive: boolean, isDeleted: boolean, createdAt: any, updatedAt: any } | null, history?: { __typename?: 'CustomerHistory', id: string, version: number, customerSnapshot: string, createdAt: any } | null }>, meta: { __typename?: 'PaginationMeta', totalRecords: number, currentPage: number, totalPages: number, recordsPerPage: number } } };

export type CustomersListQueryVariables = Exact<{
  page?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type CustomersListQuery = { __typename?: 'Query', customers: { __typename?: 'PaginatedCustomers', data: Array<{ __typename?: 'Customer', id: string, uid: string, customerId?: string | null, tenant: string, email?: string | null, firstName?: string | null, lastName?: string | null, businessName?: string | null, abn?: string | null, number?: string | null, dob?: any | null, phoneVerifiedAt?: any | null, propertyType?: number | null, tariffCode?: string | null, status?: number | null, utilmateStatus?: number | null, utilmateUpdatedAt?: any | null, utilmateUploadedManually?: number | null, gender?: number | null, relationshipStatus?: number | null, enquiryAmount?: number | null, checkCreditScore?: number | null, employerName?: string | null, riskStatus?: string | null, signDate?: any | null, signedPdfPath?: string | null, pdfAudit?: string | null, emailSent?: number | null, discount?: number | null, previousCustomerUid?: string | null, isActive: boolean, isDeleted: boolean, createdAt: any, updatedAt: any, createdBy?: string | null, updatedBy?: string | null, deletedBy?: string | null, previousBill?: { __typename?: 'CustomerDocument', id: string, filename?: string | null, path?: string | null, size?: number | null, mimeType?: string | null, createdAt: any, createdBy?: string | null, createdByUser?: { __typename?: 'User', name?: string | null } | null } | null, identityProof?: { __typename?: 'CustomerDocument', id: string, filename?: string | null, path?: string | null, size?: number | null, mimeType?: string | null, createdAt: any, createdBy?: string | null, createdByUser?: { __typename?: 'User', name?: string | null } | null } | null, ratePlan?: { __typename?: 'RatePlan', id: string, uid: string, tenant: string, codes?: string | null, planId?: string | null, dnsp?: number | null, state?: string | null, tariff?: string | null, type?: number | null, vpp?: number | null, discountApplies?: number | null, discountPercentage?: number | null, isActive: boolean, isDeleted: boolean, createdAt: any, updatedAt: any, createdBy?: string | null, updatedBy?: string | null, deletedBy?: string | null } | null, address?: { __typename?: 'CustomerAddress', id: string, customerUid: string, unitNumber?: string | null, streetNumber?: string | null, streetName?: string | null, streetType?: string | null, suburb?: string | null, state?: string | null, postcode?: string | null, country?: string | null, nmi?: string | null, isActive: boolean, isDeleted: boolean, createdAt: any, updatedAt: any } | null, solarDetails?: { __typename?: 'CustomerSolarSystem', id: string, customerUid: string, hassolar?: number | null, solarcapacity?: number | null, invertercapacity?: number | null, isActive: boolean, isDeleted: boolean, createdAt: any, updatedAt: any } | null, vppDetails?: { __typename?: 'CustomerVpp', id: string, customerUid: string, vpp?: number | null, vppConnected?: number | null, vppSignupBonus?: number | null, isActive: boolean, isDeleted: boolean, createdAt: any, updatedAt: any } | null }>, meta: { __typename?: 'PaginationMeta', totalRecords: number, currentPage: number, totalPages: number, recordsPerPage: number } } };

export type GetAllFilteredCustomerIdsQueryVariables = Exact<{
  searchId?: InputMaybe<Scalars['String']['input']>;
  searchName?: InputMaybe<Scalars['String']['input']>;
  searchMobile?: InputMaybe<Scalars['String']['input']>;
  searchAddress?: InputMaybe<Scalars['String']['input']>;
  searchTariff?: InputMaybe<Scalars['String']['input']>;
  searchDnsp?: InputMaybe<Scalars['String']['input']>;
  searchDiscount?: InputMaybe<Scalars['Int']['input']>;
  searchStatus?: InputMaybe<Scalars['Int']['input']>;
  searchVpp?: InputMaybe<Scalars['Int']['input']>;
  searchVppConnected?: InputMaybe<Scalars['Int']['input']>;
  searchUtilmateStatus?: InputMaybe<Scalars['Int']['input']>;
  searchMsatConnected?: InputMaybe<Scalars['Int']['input']>;
  searchRiskStatus?: InputMaybe<Scalars['String']['input']>;
  includeDeleted?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetAllFilteredCustomerIdsQuery = { __typename?: 'Query', customersCursor: { __typename?: 'CursorPaginatedCustomers', data: Array<{ __typename?: 'Customer', uid: string }>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean } } };

export type CustomersCursorQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  discount?: InputMaybe<Scalars['Float']['input']>;
  status?: InputMaybe<Scalars['Int']['input']>;
  searchId?: InputMaybe<Scalars['String']['input']>;
  searchName?: InputMaybe<Scalars['String']['input']>;
  searchMobile?: InputMaybe<Scalars['String']['input']>;
  searchAddress?: InputMaybe<Scalars['String']['input']>;
  searchTariff?: InputMaybe<Scalars['String']['input']>;
  searchDnsp?: InputMaybe<Scalars['String']['input']>;
  searchDiscount?: InputMaybe<Scalars['Int']['input']>;
  searchStatus?: InputMaybe<Scalars['Int']['input']>;
  searchRiskStatus?: InputMaybe<Scalars['String']['input']>;
  searchVpp?: InputMaybe<Scalars['Int']['input']>;
  searchVppConnected?: InputMaybe<Scalars['Int']['input']>;
  searchUtilmateStatus?: InputMaybe<Scalars['Int']['input']>;
  searchMsatConnected?: InputMaybe<Scalars['Int']['input']>;
  includeDeleted?: InputMaybe<Scalars['String']['input']>;
}>;


export type CustomersCursorQuery = { __typename?: 'Query', customersCursor: { __typename?: 'CursorPaginatedCustomers', data: Array<{ __typename?: 'Customer', id: string, uid: string, customerId?: string | null, tenant: string, firstName?: string | null, lastName?: string | null, number?: string | null, propertyType?: number | null, tariffCode?: string | null, status?: number | null, utilmateStatus?: number | null, riskStatus?: string | null, discount?: number | null, isDeleted: boolean, msatDetails?: { __typename?: 'CustomerMsat', msatConnected?: number | null } | null, ratePlan?: { __typename?: 'RatePlan', id: string, uid: string, dnsp?: number | null } | null, vppDetails?: { __typename?: 'CustomerVpp', vpp?: number | null, vppConnected?: number | null, vppSignupBonus?: number | null } | null, utilmateDetails?: { __typename?: 'CustomerUtilmate', utilmateConnected?: number | null } | null, address?: { __typename?: 'CustomerAddress', fullAddress?: string | null } | null }>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null, endCursor?: string | null, totalCount?: number | null } } };

export type GetCustomerByIdQueryVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type GetCustomerByIdQuery = { __typename?: 'Query', customer?: { __typename?: 'Customer', uid: string, customerId?: string | null, email?: string | null, firstName?: string | null, lastName?: string | null, businessName?: string | null, abn?: string | null, showAsBusinessName?: boolean | null, showName?: boolean | null, number?: string | null, phoneVerifiedAt?: any | null, dob?: any | null, propertyType?: number | null, tariffCode?: string | null, status?: number | null, discount?: number | null, signDate?: any | null, signedPdfPath?: string | null, emailSent?: number | null, utilmateStatus?: number | null, rateVersion?: string | null, gender?: number | null, relationshipStatus?: number | null, enquiryAmount?: number | null, checkCreditScore?: number | null, employerName?: string | null, creditScore?: number | null, isCreditScoreFetched?: number | null, riskStatus?: string | null, emailLogCount?: number | null, offerVersion?: number | null, viewCode?: string | null, isActive: boolean, isDeleted: boolean, createdAt: any, offerEmailSentAt?: any | null, updatedAt: any, address?: { __typename?: 'CustomerAddress', id: string, customerUid: string, unitNumber?: string | null, streetNumber?: string | null, streetName?: string | null, streetType?: string | null, suburb?: string | null, state?: string | null, postcode?: string | null, country?: string | null, nmi?: string | null, fullAddress?: string | null } | null, ratePlan?: { __typename?: 'RatePlan', uid: string, codes?: string | null, planId?: string | null, dnsp?: number | null, tariff?: string | null, state?: string | null, type?: number | null, vpp?: number | null, discountApplies?: number | null, discountPercentage?: number | null, offers?: Array<{ __typename?: 'RateOffer', uid: string, offerName?: string | null, anytime?: number | null, cl1Supply?: number | null, cl1Usage?: number | null, cl2Supply?: number | null, cl2Usage?: number | null, demand?: number | null, demandOp?: number | null, demandP?: number | null, demandS?: number | null, fit?: number | null, fitPeak?: number | null, fitCritical?: number | null, fitVpp?: number | null, offPeak?: number | null, peak?: number | null, shoulder?: number | null, supplyCharge?: number | null, vppOrcharge?: number | null, dynamicRates?: Record<string, unknown> | null, priceUnits?: Record<string, unknown> | null }> | null } | null, vppDetails?: { __typename?: 'CustomerVpp', vpp?: number | null, vppConnected?: number | null, vppSignupBonus?: number | null } | null, solarDetails?: { __typename?: 'CustomerSolarSystem', hassolar?: number | null, solarcapacity?: number | null, invertercapacity?: number | null } | null, batteryDetails?: { __typename?: 'CustomerBatterySystem', batterybrand?: string | null, snnumber?: string | null, batterycapacity?: number | null, exportlimit?: number | null, inverterCapacity?: number | null } | null, enrollmentDetails?: { __typename?: 'CustomerEnrollmentDetails', saletype?: number | null, connectiondate?: any | null, idtype?: number | null, idnumber?: string | null, idstate?: string | null, idcountry?: string | null, idexpiry?: any | null, concession?: number | null, lifesupport?: number | null, billingpreference?: number | null, licenseNumber?: string | null, licenseState?: string | null, licenseExpiry?: any | null } | null, debitDetails?: { __typename?: 'CustomerDebitDetails', optIn?: number | null, accountType?: number | null, firstName?: string | null, lastName?: string | null, bankName?: string | null, bankAddress?: string | null, bsb?: string | null, accountNumber?: string | null, paymentFrequency?: number | null, firstDebitDate?: any | null } | null, utilmateDetails?: { __typename?: 'CustomerUtilmate', utilmateConnected?: number | null } | null, previousBill?: { __typename?: 'CustomerDocument', id: string, filename?: string | null, path?: string | null } | null, identityProof?: { __typename?: 'CustomerDocument', id: string, filename?: string | null, path?: string | null } | null, licenseDocument?: { __typename?: 'CustomerDocument', id: string, filename?: string | null, path?: string | null } | null } | null };

export type GetCustomerGeneralDetailsQueryVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type GetCustomerGeneralDetailsQuery = { __typename?: 'Query', customer?: { __typename?: 'Customer', uid: string, customerId?: string | null, email?: string | null, firstName?: string | null, lastName?: string | null, businessName?: string | null, abn?: string | null, showAsBusinessName?: boolean | null, showName?: boolean | null, number?: string | null, phoneVerifiedAt?: any | null, dob?: any | null, propertyType?: number | null, tariffCode?: string | null, status?: number | null, discount?: number | null, signDate?: any | null, signedPdfPath?: string | null, emailSent?: number | null, utilmateStatus?: number | null, rateVersion?: string | null, gender?: number | null, relationshipStatus?: number | null, enquiryAmount?: number | null, checkCreditScore?: number | null, employerName?: string | null, creditScore?: number | null, isCreditScoreFetched?: number | null, riskStatus?: string | null, emailLogCount?: number | null, offerVersion?: number | null, viewCode?: string | null, isActive: boolean, isDeleted: boolean, createdAt: any, offerEmailSentAt?: any | null, updatedAt: any, address?: { __typename?: 'CustomerAddress', id: string, customerUid: string, unitNumber?: string | null, streetNumber?: string | null, streetName?: string | null, streetType?: string | null, suburb?: string | null, state?: string | null, postcode?: string | null, country?: string | null, nmi?: string | null, fullAddress?: string | null } | null, ratePlan?: { __typename?: 'RatePlan', uid: string, codes?: string | null, planId?: string | null, dnsp?: number | null, tariff?: string | null, state?: string | null, type?: number | null, vpp?: number | null, discountApplies?: number | null, discountPercentage?: number | null, offers?: Array<{ __typename?: 'RateOffer', uid: string, offerName?: string | null, anytime?: number | null, cl1Supply?: number | null, cl1Usage?: number | null, cl2Supply?: number | null, cl2Usage?: number | null, demand?: number | null, demandOp?: number | null, demandP?: number | null, demandS?: number | null, fit?: number | null, fitPeak?: number | null, fitCritical?: number | null, fitVpp?: number | null, offPeak?: number | null, peak?: number | null, shoulder?: number | null, supplyCharge?: number | null, vppOrcharge?: number | null, dynamicRates?: Record<string, unknown> | null, priceUnits?: Record<string, unknown> | null }> | null } | null, vppDetails?: { __typename?: 'CustomerVpp', vpp?: number | null, vppConnected?: number | null, vppSignupBonus?: number | null } | null, solarDetails?: { __typename?: 'CustomerSolarSystem', hassolar?: number | null, solarcapacity?: number | null, invertercapacity?: number | null } | null, batteryDetails?: { __typename?: 'CustomerBatterySystem', batterybrand?: string | null, snnumber?: string | null, batterycapacity?: number | null, exportlimit?: number | null, inverterCapacity?: number | null } | null, enrollmentDetails?: { __typename?: 'CustomerEnrollmentDetails', saletype?: number | null, connectiondate?: any | null, idtype?: number | null, idnumber?: string | null, idstate?: string | null, idcountry?: string | null, idexpiry?: any | null, concession?: number | null, lifesupport?: number | null, billingpreference?: number | null, licenseNumber?: string | null, licenseState?: string | null, licenseExpiry?: any | null } | null, debitDetails?: { __typename?: 'CustomerDebitDetails', optIn?: number | null, accountType?: number | null, firstName?: string | null, lastName?: string | null, bankName?: string | null, bankAddress?: string | null, bsb?: string | null, accountNumber?: string | null, paymentFrequency?: number | null, firstDebitDate?: any | null } | null, utilmateDetails?: { __typename?: 'CustomerUtilmate', utilmateConnected?: number | null } | null, previousBill?: { __typename?: 'CustomerDocument', id: string, filename?: string | null, path?: string | null } | null, identityProof?: { __typename?: 'CustomerDocument', id: string, filename?: string | null, path?: string | null } | null, licenseDocument?: { __typename?: 'CustomerDocument', id: string, filename?: string | null, path?: string | null } | null, vppCertificateDetails?: { __typename?: 'CustomerVppCertificateDetails', isAllRequiredFilled?: number | null, isVppCertificateEmailSent?: number | null, isVppCertificateEmailSentAt?: any | null } | null } | null };

export type GetCustomerSolarVppDetailsQueryVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type GetCustomerSolarVppDetailsQuery = { __typename?: 'Query', customer?: { __typename?: 'Customer', uid: string, vppDetails?: { __typename?: 'CustomerVpp', id: string, customerUid: string, vpp?: number | null, vppConnected?: number | null, vppSignupBonus?: number | null } | null, solarDetails?: { __typename?: 'CustomerSolarSystem', id: string, customerUid: string, hassolar?: number | null, solarcapacity?: number | null, invertercapacity?: number | null } | null, batteryDetails?: { __typename?: 'CustomerBatterySystem', id: string, customerUid: string, batterybrand?: string | null, snnumber?: string | null, batterycapacity?: number | null, exportlimit?: number | null, inverterCapacity?: number | null, checkCode?: string | null, isActive: boolean, isDeleted: boolean, createdAt: any, updatedAt: any } | null } | null };

export type GetCustomerVppCertificateDetailsQueryVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type GetCustomerVppCertificateDetailsQuery = { __typename?: 'Query', customer?: { __typename?: 'Customer', uid: string, vppCertificateDetails?: { __typename?: 'CustomerVppCertificateDetails', id: string, certificateNo?: string | null, issueDate?: any | null, batteryManufacturer?: string | null, batteryModel?: string | null, batterySerialNumber?: string | null, batteryInstalledDate?: any | null, batteryUsableCapacity?: number | null, batteryPortConnected?: number | null, inverterManufacturer?: string | null, inverterModel?: string | null, inverterSnNumbers?: string | null, inverterCapacity?: number | null, isLifeSupportEquipment?: number | null, ifYesDetails?: string | null, internetConnectionType?: number | null, internetOtherText?: string | null, modemRouterLocation?: string | null, apiIntegration?: number | null, remoteChargesCommandTest?: number | null, remoteChargesCommandTestAt?: any | null, remoteDischargesCommandTest?: number | null, remoteDischargesCommandTestAt?: any | null, stateOfChangeMonitoring?: number | null, stateOfChangeMonitoringAt?: any | null, gridExportVerification?: number | null, gridExportVerificationAt?: any | null, gridImportVerification?: number | null, gridImportVerificationAt?: any | null, communicationFailSafeTest?: number | null, communicationFailSafeTestAt?: any | null, testResult?: string | null, additionalNotes?: string | null, isAllRequiredFilled?: number | null, isVppCertificateEmailSent?: number | null, isVppCertificateEmailSentAt?: any | null } | null } | null };

export type GetCustomerDebitDetailsQueryVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type GetCustomerDebitDetailsQuery = { __typename?: 'Query', customer?: { __typename?: 'Customer', uid: string, debitDetails?: { __typename?: 'CustomerDebitDetails', id: string, customerUid: string, accountType?: number | null, companyName?: string | null, abn?: string | null, firstName?: string | null, lastName?: string | null, bankName?: string | null, bankAddress?: string | null, bsb?: string | null, accountNumber?: string | null, paymentFrequency?: number | null, firstDebitDate?: any | null, optIn?: number | null } | null } | null };

export type GetCustomerUtilmateDetailsQueryVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type GetCustomerUtilmateDetailsQuery = { __typename?: 'Query', customer?: { __typename?: 'Customer', uid: string, utilmateDetails?: { __typename?: 'CustomerUtilmate', id: string, customerUid: string, siteIdentifier?: string | null, accountNumber?: string | null, utilmateConnected?: number | null, utilmateConnectedAt?: any | null } | null, msatDetails?: { __typename?: 'CustomerMsat', id: string, customerUid: string, msatConnected?: number | null, msatConnectedAt?: any | null, msatUpdatedAt?: any | null } | null } | null };

export type GetCustomerDocumentsQueryVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type GetCustomerDocumentsQuery = { __typename?: 'Query', customer?: { __typename?: 'Customer', uid: string, previousBill?: { __typename?: 'CustomerDocument', id: string, uid: string, customerUid: string, filename?: string | null, path?: string | null, size?: number | null, mimeType?: string | null, createdAt: any, updatedAt: any, createdBy?: string | null, documentType?: { __typename?: 'DocumentType', uid: string, name: string, color?: string | null, category?: string | null } | null, createdByUser?: { __typename?: 'User', uid: string, name?: string | null } | null } | null, identityProof?: { __typename?: 'CustomerDocument', id: string, uid: string, customerUid: string, filename?: string | null, path?: string | null, size?: number | null, mimeType?: string | null, createdAt: any, updatedAt: any, createdBy?: string | null, documentType?: { __typename?: 'DocumentType', uid: string, name: string, color?: string | null, category?: string | null } | null, createdByUser?: { __typename?: 'User', uid: string, name?: string | null } | null } | null, licenseDocument?: { __typename?: 'CustomerDocument', id: string, uid: string, customerUid: string, filename?: string | null, path?: string | null, size?: number | null, mimeType?: string | null, createdAt: any, updatedAt: any, createdBy?: string | null, documentType?: { __typename?: 'DocumentType', uid: string, name: string, color?: string | null, category?: string | null } | null, createdByUser?: { __typename?: 'User', uid: string, name?: string | null } | null } | null, documents?: Array<{ __typename?: 'CustomerDocument', id: string, uid: string, customerUid: string, type?: string | null, name?: string | null, filename?: string | null, path?: string | null, size?: number | null, mimeType?: string | null, startDate?: any | null, endDate?: any | null, createdAt: any, createdBy?: string | null, documentType?: { __typename?: 'DocumentType', uid: string, name: string, color?: string | null, category?: string | null } | null, createdByUser?: { __typename?: 'User', uid: string, name?: string | null } | null } | null> | null } | null };

export type CheckAddressExistsQueryVariables = Exact<{
  address: CustomerAddressInput;
}>;


export type CheckAddressExistsQuery = { __typename?: 'Query', checkAddressExists?: { __typename?: 'Customer', uid: string, customerId?: string | null, firstName?: string | null, lastName?: string | null, businessName?: string | null, abn?: string | null } | null };

export type CheckNmiExistsQueryVariables = Exact<{
  nmi: Scalars['String']['input'];
}>;


export type CheckNmiExistsQuery = { __typename?: 'Query', checkNmiExists?: { __typename?: 'Customer', uid: string, customerId?: string | null, firstName?: string | null, lastName?: string | null, businessName?: string | null, abn?: string | null } | null };

export type ValidateCustomerAccessCodeQueryVariables = Exact<{
  customerId: Scalars['String']['input'];
  code: Scalars['String']['input'];
}>;


export type ValidateCustomerAccessCodeQuery = { __typename?: 'Query', validateCustomerAccessCode: boolean };

export type GetCustomerByCustomerIdQueryVariables = Exact<{
  customerId: Scalars['String']['input'];
}>;


export type GetCustomerByCustomerIdQuery = { __typename?: 'Query', customerByCustomerId?: { __typename?: 'Customer', uid: string, customerId?: string | null, email?: string | null, firstName?: string | null, lastName?: string | null, businessName?: string | null, abn?: string | null, showAsBusinessName?: boolean | null, showName?: boolean | null, number?: string | null, dob?: any | null, propertyType?: number | null, tariffCode?: string | null, status?: number | null, discount?: number | null, signDate?: any | null, emailSent?: number | null, offerEmailSentAt?: any | null, utilmateStatus?: number | null, viewCode?: string | null, isActive: boolean, isDeleted: boolean, createdAt: any, phoneVerifiedAt?: any | null, updatedAt: any, rateVersion?: string | null, offerVersion?: number | null, address?: { __typename?: 'CustomerAddress', id: string, customerUid: string, unitNumber?: string | null, streetNumber?: string | null, streetName?: string | null, streetType?: string | null, suburb?: string | null, state?: string | null, postcode?: string | null, country?: string | null, nmi?: string | null, fullAddress?: string | null } | null, msatDetails?: { __typename?: 'CustomerMsat', id: string, customerUid: string, msatConnected?: number | null, msatConnectedAt?: any | null, msatUpdatedAt?: any | null } | null, vppDetails?: { __typename?: 'CustomerVpp', id: string, customerUid: string, vpp?: number | null, vppConnected?: number | null, vppSignupBonus?: number | null } | null, solarDetails?: { __typename?: 'CustomerSolarSystem', id: string, customerUid: string, hassolar?: number | null, solarcapacity?: number | null, invertercapacity?: number | null } | null, batteryDetails?: { __typename?: 'CustomerBatterySystem', id: string, customerUid: string, batterybrand?: string | null, snnumber?: string | null, batterycapacity?: number | null, exportlimit?: number | null, inverterCapacity?: number | null, checkCode?: string | null, isActive: boolean, isDeleted: boolean, createdAt: any, updatedAt: any } | null, debitDetails?: { __typename?: 'CustomerDebitDetails', id: string, customerUid: string, accountType?: number | null, companyName?: string | null, abn?: string | null, firstName?: string | null, lastName?: string | null, bankName?: string | null, bankAddress?: string | null, bsb?: string | null, accountNumber?: string | null, paymentFrequency?: number | null, firstDebitDate?: any | null, optIn?: number | null } | null, ratePlan?: { __typename?: 'RatePlan', uid: string, codes?: string | null, planId?: string | null, dnsp?: number | null, tariff?: string | null, vpp?: number | null, offers?: Array<{ __typename?: 'RateOffer', uid: string, offerName?: string | null, anytime?: number | null, cl1Supply?: number | null, cl1Usage?: number | null, cl2Supply?: number | null, cl2Usage?: number | null, demand?: number | null, demandOp?: number | null, demandP?: number | null, demandS?: number | null, fit?: number | null, fitPeak?: number | null, fitCritical?: number | null, fitVpp?: number | null, offPeak?: number | null, peak?: number | null, shoulder?: number | null, supplyCharge?: number | null, vppOrcharge?: number | null, dynamicRates?: Record<string, unknown> | null, priceUnits?: Record<string, unknown> | null }> | null } | null, enrollmentDetails?: { __typename?: 'CustomerEnrollmentDetails', id: string, customerUid: string, saletype?: number | null, connectiondate?: any | null, idtype?: number | null, idnumber?: string | null, idstate?: string | null, idcountry?: string | null, idexpiry?: any | null, concession?: number | null, lifesupport?: number | null, billingpreference?: number | null } | null, documents?: Array<{ __typename?: 'CustomerDocument', id: string, uid: string, customerUid: string, type?: string | null, name?: string | null, filename?: string | null, path?: string | null, size?: number | null, mimeType?: string | null, createdAt: any, createdBy?: string | null, createdByUser?: { __typename?: 'User', uid: string, name?: string | null } | null } | null> | null } | null };

export type GetDocumentTypesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetDocumentTypesQuery = { __typename?: 'Query', documentTypes: Array<{ __typename?: 'DocumentType', uid: string, name: string, color?: string | null, category?: string | null, isActive?: number | null }> };

export type GetRiskStatusesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetRiskStatusesQuery = { __typename?: 'Query', riskStatuses: Array<{ __typename?: 'RiskStatus', id: string, uid: string, name: string, code: string, description?: string | null, color?: string | null, scoreMin?: number | null, scoreMax?: number | null, manualOffer?: number | null, sortOrder?: number | null, isActive: boolean }> };

export type SearchCustomersBasicQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']['input']>;
  searchName?: InputMaybe<Scalars['String']['input']>;
}>;


export type SearchCustomersBasicQuery = { __typename?: 'Query', customersCursor: { __typename?: 'CursorPaginatedCustomers', data: Array<{ __typename?: 'Customer', uid: string, customerId?: string | null, firstName?: string | null, lastName?: string | null, address?: { __typename?: 'CustomerAddress', fullAddress?: string | null } | null }> } };

export type GetCustomerBillingInfoQueryVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type GetCustomerBillingInfoQuery = { __typename?: 'Query', customer?: { __typename?: 'Customer', uid: string, customerId?: string | null, firstName?: string | null, lastName?: string | null, email?: string | null, number?: string | null, creditScore?: number | null, riskStatus?: string | null, address?: { __typename?: 'CustomerAddress', fullAddress?: string | null } | null, enrollmentDetails?: { __typename?: 'CustomerEnrollmentDetails', billingpreference?: number | null } | null, debitDetails?: { __typename?: 'CustomerDebitDetails', optIn?: number | null } | null, utilmateDetails?: { __typename?: 'CustomerUtilmate', accountNumber?: string | null, siteIdentifier?: string | null } | null } | null };

export type GetCustomerDashboardQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCustomerDashboardQuery = { __typename?: 'Query', customerDashboard: { __typename?: 'CustomerDashboardSummary', utilmateStatusSummary: { __typename?: 'SummaryCategory', count: number, customers: Array<{ __typename?: 'CustomerSummaryItem', uid: string, customerId?: string | null, firstName?: string | null, lastName?: string | null, email?: string | null, status?: number | null, utilmateStatus?: number | null }> }, signedStatusSummary: { __typename?: 'SummaryCategory', count: number, customers: Array<{ __typename?: 'CustomerSummaryItem', uid: string, customerId?: string | null, firstName?: string | null, lastName?: string | null, email?: string | null, status?: number | null }> }, vppPendingSummary: { __typename?: 'SummaryCategory', count: number, customers: Array<{ __typename?: 'CustomerSummaryItem', uid: string, customerId?: string | null, firstName?: string | null, lastName?: string | null, email?: string | null, status?: number | null, vppConnected?: number | null }> } } };

export type GetAllEmailLogsQueryVariables = Exact<{
  page?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['Int']['input']>;
  emailType?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetAllEmailLogsQuery = { __typename?: 'Query', allEmailLogs: { __typename?: 'PaginatedEmailLogs', meta: { __typename?: 'PaginationMeta', totalRecords: number, currentPage: number, totalPages: number, recordsPerPage: number }, data: Array<{ __typename?: 'CustomerEmailLog', id: string, customerUid: string, customerId?: string | null, emailTo?: string | null, emailType?: string | null, subject?: string | null, body?: string | null, status: number, errorMessage?: string | null, sentAt?: any | null, verifiedAt?: any | null, createdAt: any, createdBy?: string | null, tenant?: string | null, verificationCode?: string | null }> } };

export type GetCustomerEmailLogsQueryVariables = Exact<{
  customerUid: Scalars['String']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetCustomerEmailLogsQuery = { __typename?: 'Query', customerEmailLogs: { __typename?: 'PaginatedEmailLogs', meta: { __typename?: 'PaginationMeta', totalRecords: number, currentPage: number, totalPages: number, recordsPerPage: number }, data: Array<{ __typename?: 'CustomerEmailLog', id: string, customerUid: string, customerId?: string | null, emailTo?: string | null, emailType?: string | null, subject?: string | null, body?: string | null, status: number, errorMessage?: string | null, sentAt?: any | null, verifiedAt?: any | null, createdAt: any, createdBy?: string | null, tenant?: string | null, verificationCode?: string | null }> } };

export type GetAllEmailSettingsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllEmailSettingsQuery = { __typename?: 'Query', emailSettings: Array<{ __typename?: 'EmailSetting', id: string, eventType: string, templateUid?: string | null, isActive: boolean, template?: { __typename?: 'EmailTemplate', uid: string, name: string } | null }> };

export type UpdateEmailSettingMutationVariables = Exact<{
  eventType: Scalars['String']['input'];
  templateUid?: InputMaybe<Scalars['String']['input']>;
}>;


export type UpdateEmailSettingMutation = { __typename?: 'Mutation', updateEmailSetting: { __typename?: 'EmailSetting', id: string, eventType: string, templateUid?: string | null, isActive: boolean, template?: { __typename?: 'EmailTemplate', uid: string, name: string } | null } };

export type GetEmailTemplatesQueryVariables = Exact<{
  page?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<Scalars['Int']['input']>;
  entityType?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetEmailTemplatesQuery = { __typename?: 'Query', emailTemplates: { __typename?: 'PaginatedEmailTemplates', data: Array<{ __typename?: 'EmailTemplate', id: string, uid: string, name: string, subject: string, entityType?: number | null, status: number, isActive: boolean, isDeleted: boolean, createdAt: any, updatedAt: any }>, meta: { __typename?: 'PaginationMeta', totalRecords: number, currentPage: number, totalPages: number, recordsPerPage: number } } };

export type GetEmailTemplateQueryVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type GetEmailTemplateQuery = { __typename?: 'Query', emailTemplate?: { __typename?: 'EmailTemplate', id: string, uid: string, name: string, entityType?: number | null, subject: string, body?: string | null, status: number, isActive: boolean, isDeleted: boolean, createdAt: any, updatedAt: any } | null };

export type PreviewSystemTemplateQueryVariables = Exact<{
  eventType: Scalars['String']['input'];
}>;


export type PreviewSystemTemplateQuery = { __typename?: 'Query', previewSystemTemplate: { __typename?: 'SystemTemplatePreview', subject: string, body: string } };

export type GetMenusQueryVariables = Exact<{
  page?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetMenusQuery = { __typename?: 'Query', menus: { __typename?: 'PaginatedMenus', data: Array<{ __typename?: 'Menu', uid: string, name: string, code: string, parentUid?: string | null }>, meta: { __typename?: 'PaginationMeta', totalRecords: number } } };

export type GetFeaturesQueryVariables = Exact<{
  menuUid?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetFeaturesQuery = { __typename?: 'Query', features: Array<{ __typename?: 'Feature', id: string, uid: string, name: string, code: string, description?: string | null, menuUid: string, isActive: boolean }> };

export type GetCustomerNotesQueryVariables = Exact<{
  customerUid: Scalars['String']['input'];
}>;


export type GetCustomerNotesQuery = { __typename?: 'Query', customerNotes: Array<{ __typename?: 'CustomerNote', id: string, uid: string, customerUid: string, userUid: string, message: string, followUp?: any | null, assignedTo?: string | null, type?: string | null, createdAt: any, createdByName?: string | null, assignedToUser?: { __typename?: 'User', uid: string, name?: string | null } | null, noteTypeDetails?: { __typename?: 'NoteType', uid: string, name: string, color?: string | null } | null }> };

export type GetNoteTypesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetNoteTypesQuery = { __typename?: 'Query', noteTypes: Array<{ __typename?: 'NoteType', uid: string, name: string, color?: string | null, isActive?: number | null, createdAt: any, createdBy?: string | null }> };

export type GetNotificationEntitiesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetNotificationEntitiesQuery = { __typename?: 'Query', notificationEntities: Array<{ __typename?: 'NotificationEntity', id: string, uid: string, tenant: string, fromEmail: string, bccEmail?: string | null, preference?: number | null, entityType: number, isActive?: number | null, userUids?: Array<string> | null, createdAt: any, updatedAt: any }> };

export type GetNotificationEntityQueryVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type GetNotificationEntityQuery = { __typename?: 'Query', notificationEntity?: { __typename?: 'NotificationEntity', id: string, uid: string, tenant: string, fromEmail: string, bccEmail?: string | null, preference?: number | null, entityType: number, isActive?: number | null, userUids?: Array<string> | null, createdAt: any, updatedAt: any } | null };

export type GetPdfTermsListQueryVariables = Exact<{
  page?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetPdfTermsListQuery = { __typename?: 'Query', pdfTermsList: { __typename?: 'PaginatedPdfTerms', data: Array<{ __typename?: 'PdfTerm', id: string, uid: string, name: string, rateType?: string | null, rateUids?: Array<string> | null, isActive: boolean, isDeleted: boolean, createdAt: any, updatedAt: any }>, meta: { __typename?: 'PaginationMeta', totalRecords: number, currentPage: number, totalPages: number, recordsPerPage: number } } };

export type GetPdfTermQueryVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type GetPdfTermQuery = { __typename?: 'Query', pdfTerm?: { __typename?: 'PdfTerm', id: string, uid: string, name: string, content?: string | null, rateType?: string | null, rateUids?: Array<string> | null, isActive: boolean, isDeleted: boolean, createdAt: any, updatedAt: any } | null };

export type GetRolePermissionsQueryVariables = Exact<{
  roleUid: Scalars['String']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetRolePermissionsQuery = { __typename?: 'Query', rolePermissions: { __typename?: 'PaginatedPermissions', data: Array<{ __typename?: 'RoleMenuPermission', id: string, roleUid: string, menuUid: string, canView: boolean, canCreate: boolean, canEdit: boolean, canDelete: boolean }> } };

export type GetRoleFeaturePermissionsQueryVariables = Exact<{
  roleUid: Scalars['String']['input'];
}>;


export type GetRoleFeaturePermissionsQuery = { __typename?: 'Query', roleFeaturePermissions: Array<{ __typename?: 'RoleFeaturePermission', id: string, roleUid: string, featureUid: string, isEnabled: boolean }> };

export type RatePlansQueryVariables = Exact<{
  page?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  state?: InputMaybe<Scalars['String']['input']>;
  dnsp?: InputMaybe<Scalars['Int']['input']>;
  type?: InputMaybe<Scalars['Int']['input']>;
}>;


export type RatePlansQuery = { __typename?: 'Query', ratePlans: { __typename?: 'PaginatedRatePlans', data: Array<{ __typename?: 'RatePlan', id: string, uid: string, tenant: string, codes?: string | null, planId?: string | null, dnsp?: number | null, state?: string | null, tariff?: string | null, type?: number | null, vpp?: number | null, discountApplies?: number | null, discountPercentage?: number | null, isActive: boolean, isDeleted: boolean, createdAt: any, updatedAt: any, createdBy?: string | null, updatedBy?: string | null, deletedBy?: string | null, offers?: Array<{ __typename?: 'RateOffer', id: string, uid: string, ratePlanUid: string, tenant: string, offerName?: string | null, anytime?: number | null, cl1Supply?: number | null, cl1Usage?: number | null, cl2Supply?: number | null, cl2Usage?: number | null, demand?: number | null, demandOp?: number | null, demandP?: number | null, demandS?: number | null, fit?: number | null, fitPeak?: number | null, fitCritical?: number | null, fitVpp?: number | null, offPeak?: number | null, peak?: number | null, shoulder?: number | null, supplyCharge?: number | null, vppOrcharge?: number | null, dynamicRates?: Record<string, unknown> | null, priceUnits?: Record<string, unknown> | null, isActive: boolean, isDeleted: boolean, createdAt: any, updatedAt: any, createdBy?: string | null, updatedBy?: string | null, deletedBy?: string | null }> | null }>, meta: { __typename?: 'PaginationMeta', totalRecords: number, currentPage: number, totalPages: number, recordsPerPage: number } } };

export type RatesHistoryQueryVariables = Exact<{
  page?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  ratePlanUid?: InputMaybe<Scalars['String']['input']>;
  auditAction?: InputMaybe<Scalars['String']['input']>;
}>;


export type RatesHistoryQuery = { __typename?: 'Query', ratesHistory: { __typename?: 'PaginatedRatesHistory', data: Array<{ __typename?: 'RatesHistoryRecord', id: string, uid: string, version?: string | null, ratePlanUid: string, auditAction: string, createdAt: any, createdBy?: string | null, createdByName?: string | null, activeVersion?: number | null, newRecord?: string | null }>, meta: { __typename?: 'PaginationMeta', totalRecords: number, currentPage: number, totalPages: number, recordsPerPage: number } } };

export type HistoryDetailsQueryVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type HistoryDetailsQuery = { __typename?: 'Query', ratesHistoryRecord?: { __typename?: 'RatesHistoryRecord', uid: string, newRecord?: string | null, oldRecord?: string | null } | null };

export type GlobalActiveRatesHistoryQueryVariables = Exact<{ [key: string]: never; }>;


export type GlobalActiveRatesHistoryQuery = { __typename?: 'Query', globalActiveRatesHistory?: { __typename?: 'RatesHistoryRecord', uid: string, version?: string | null, newRecord?: string | null, activeVersion?: number | null, createdAt: any, createdByName?: string | null } | null };

export type HasRatesChangesQueryVariables = Exact<{ [key: string]: never; }>;


export type HasRatesChangesQuery = { __typename?: 'Query', hasRatesChanges: { __typename?: 'RatesChangesResponse', hasChanges: boolean, changedRatePlanUids: Array<string>, changes: Array<{ __typename?: 'ChangedRatePlan', uid: string, newRecord?: string | null, oldRecord?: string | null }> } };

export type RatesHistoryByVersionQueryVariables = Exact<{
  version: Scalars['String']['input'];
}>;


export type RatesHistoryByVersionQuery = { __typename?: 'Query', ratesHistoryByVersion?: { __typename?: 'RatesHistoryRecord', uid: string, version?: string | null, newRecord?: string | null, activeVersion?: number | null, createdAt: any } | null };

export type MeasurementUnitsQueryVariables = Exact<{ [key: string]: never; }>;


export type MeasurementUnitsQuery = { __typename?: 'Query', measurementUnits: Array<{ __typename?: 'MeasurementUnit', id: string, uid: string, name: string }> };

export type GetRolesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetRolesQuery = { __typename?: 'Query', roles: { __typename?: 'PaginatedRoles', data: Array<{ __typename?: 'Role', uid: string, name: string, description?: string | null, isActive: boolean, isDeleted: boolean, createdAt: any }> } };

export type GetUserPermissionsQueryVariables = Exact<{
  userUid: Scalars['String']['input'];
}>;


export type GetUserPermissionsQuery = { __typename?: 'Query', userPermissions: Array<{ __typename?: 'UserMenuPermission', id: string, userUid: string, menuUid: string, canView?: boolean | null, canCreate?: boolean | null, canEdit?: boolean | null, canDelete?: boolean | null }> };

export type GetUserFeaturePermissionsQueryVariables = Exact<{
  userUid: Scalars['String']['input'];
}>;


export type GetUserFeaturePermissionsQuery = { __typename?: 'Query', userFeaturePermissions: Array<{ __typename?: 'UserFeaturePermission', id: string, userUid: string, featureUid: string, isEnabled?: boolean | null }> };

export type GetUsersQueryVariables = Exact<{
  page?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  roleUid?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetUsersQuery = { __typename?: 'Query', users: { __typename?: 'PaginatedUsers', meta: { __typename?: 'PaginationMeta', totalRecords: number, currentPage: number, totalPages: number, recordsPerPage: number }, data: Array<{ __typename?: 'User', uid: string, email?: string | null, password?: string | null, name?: string | null, number?: string | null, tenant: string, roleUid?: string | null, roleName?: string | null, status: UserStatus, isActive: boolean, isDeleted: boolean, createdAt: any }> } };

export type GetUserByIdQueryVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type GetUserByIdQuery = { __typename?: 'Query', user?: { __typename?: 'User', uid: string, email?: string | null, name?: string | null, number?: string | null, tenant: string, roleUid?: string | null, roleName?: string | null, status: UserStatus, isActive: boolean, isDeleted: boolean, createdAt: any } | null };

export const CustomerBasicFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CustomerBasicFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Customer"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"customerId"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<CustomerBasicFieldsFragment, unknown>;
export const CustomerAddressFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CustomerAddressFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomerAddress"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"streetName"}},{"kind":"Field","name":{"kind":"Name","value":"suburb"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"postcode"}},{"kind":"Field","name":{"kind":"Name","value":"country"}}]}}]} as unknown as DocumentNode<CustomerAddressFieldsFragment, unknown>;
export const UserFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"password"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"tenant"}},{"kind":"Field","name":{"kind":"Name","value":"roleUid"}},{"kind":"Field","name":{"kind":"Name","value":"roleName"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]} as unknown as DocumentNode<UserFieldsFragment, unknown>;
export const RatePlanFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RatePlanFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"RatePlan"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"tenant"}},{"kind":"Field","name":{"kind":"Name","value":"codes"}},{"kind":"Field","name":{"kind":"Name","value":"planId"}},{"kind":"Field","name":{"kind":"Name","value":"dnsp"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"tariff"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"vpp"}},{"kind":"Field","name":{"kind":"Name","value":"discountApplies"}},{"kind":"Field","name":{"kind":"Name","value":"discountPercentage"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"}},{"kind":"Field","name":{"kind":"Name","value":"updatedBy"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]} as unknown as DocumentNode<RatePlanFieldsFragment, unknown>;
export const RateOfferFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RateOfferFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"RateOffer"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"ratePlanUid"}},{"kind":"Field","name":{"kind":"Name","value":"tenant"}},{"kind":"Field","name":{"kind":"Name","value":"offerName"}},{"kind":"Field","name":{"kind":"Name","value":"anytime"}},{"kind":"Field","name":{"kind":"Name","value":"cl1Supply"}},{"kind":"Field","name":{"kind":"Name","value":"cl1Usage"}},{"kind":"Field","name":{"kind":"Name","value":"cl2Supply"}},{"kind":"Field","name":{"kind":"Name","value":"cl2Usage"}},{"kind":"Field","name":{"kind":"Name","value":"demand"}},{"kind":"Field","name":{"kind":"Name","value":"demandOp"}},{"kind":"Field","name":{"kind":"Name","value":"demandP"}},{"kind":"Field","name":{"kind":"Name","value":"demandS"}},{"kind":"Field","name":{"kind":"Name","value":"fit"}},{"kind":"Field","name":{"kind":"Name","value":"fitPeak"}},{"kind":"Field","name":{"kind":"Name","value":"fitCritical"}},{"kind":"Field","name":{"kind":"Name","value":"fitVpp"}},{"kind":"Field","name":{"kind":"Name","value":"offPeak"}},{"kind":"Field","name":{"kind":"Name","value":"peak"}},{"kind":"Field","name":{"kind":"Name","value":"shoulder"}},{"kind":"Field","name":{"kind":"Name","value":"supplyCharge"}},{"kind":"Field","name":{"kind":"Name","value":"vppOrcharge"}},{"kind":"Field","name":{"kind":"Name","value":"dynamicRates"}},{"kind":"Field","name":{"kind":"Name","value":"priceUnits"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"}},{"kind":"Field","name":{"kind":"Name","value":"updatedBy"}}]}}]} as unknown as DocumentNode<RateOfferFieldsFragment, unknown>;
export const LoginDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Login"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"LoginInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"login"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accessToken"}},{"kind":"Field","name":{"kind":"Name","value":"refreshToken"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<LoginMutation, LoginMutationVariables>;
export const RefreshTokenDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RefreshToken"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"refreshToken"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"refreshToken"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"refreshToken"},"value":{"kind":"Variable","name":{"kind":"Name","value":"refreshToken"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accessToken"}},{"kind":"Field","name":{"kind":"Name","value":"refreshToken"}}]}}]}}]} as unknown as DocumentNode<RefreshTokenMutation, RefreshTokenMutationVariables>;
export const CreateDocumentTypeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateDocumentType"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"color"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"category"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createDocumentType"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"color"},"value":{"kind":"Variable","name":{"kind":"Name","value":"color"}}},{"kind":"Argument","name":{"kind":"Name","value":"category"},"value":{"kind":"Variable","name":{"kind":"Name","value":"category"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}}]}}]}}]} as unknown as DocumentNode<CreateDocumentTypeMutation, CreateDocumentTypeMutationVariables>;
export const UpdateDocumentTypeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateDocumentType"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"color"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"category"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"isActive"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateDocumentType"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uid"}}},{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"color"},"value":{"kind":"Variable","name":{"kind":"Name","value":"color"}}},{"kind":"Argument","name":{"kind":"Name","value":"category"},"value":{"kind":"Variable","name":{"kind":"Name","value":"category"}}},{"kind":"Argument","name":{"kind":"Name","value":"isActive"},"value":{"kind":"Variable","name":{"kind":"Name","value":"isActive"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}}]}}]}}]} as unknown as DocumentNode<UpdateDocumentTypeMutation, UpdateDocumentTypeMutationVariables>;
export const DeleteDocumentTypeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteDocumentType"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteDocumentType"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uid"}}}]}]}}]} as unknown as DocumentNode<DeleteDocumentTypeMutation, DeleteDocumentTypeMutationVariables>;
export const CreateEmailTemplateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateEmailTemplate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateEmailTemplateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createEmailTemplate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<CreateEmailTemplateMutation, CreateEmailTemplateMutationVariables>;
export const UpdateEmailTemplateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateEmailTemplate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateEmailTemplateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateEmailTemplate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uid"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<UpdateEmailTemplateMutation, UpdateEmailTemplateMutationVariables>;
export const SoftDeleteEmailTemplateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SoftDeleteEmailTemplate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"softDeleteEmailTemplate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uid"}}}]}]}}]} as unknown as DocumentNode<SoftDeleteEmailTemplateMutation, SoftDeleteEmailTemplateMutationVariables>;
export const RestoreEmailTemplateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RestoreEmailTemplate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"restoreEmailTemplate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uid"}}}]}]}}]} as unknown as DocumentNode<RestoreEmailTemplateMutation, RestoreEmailTemplateMutationVariables>;
export const SendBulkEmailDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SendBulkEmail"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"templateUid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"customerUids"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cc"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"bcc"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"attachments"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"EmailAttachmentInput"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sendBulkEmail"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"templateUid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"templateUid"}}},{"kind":"Argument","name":{"kind":"Name","value":"customerUids"},"value":{"kind":"Variable","name":{"kind":"Name","value":"customerUids"}}},{"kind":"Argument","name":{"kind":"Name","value":"cc"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cc"}}},{"kind":"Argument","name":{"kind":"Name","value":"bcc"},"value":{"kind":"Variable","name":{"kind":"Name","value":"bcc"}}},{"kind":"Argument","name":{"kind":"Name","value":"attachments"},"value":{"kind":"Variable","name":{"kind":"Name","value":"attachments"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"sentCount"}},{"kind":"Field","name":{"kind":"Name","value":"failedCount"}}]}}]}}]} as unknown as DocumentNode<SendBulkEmailMutation, SendBulkEmailMutationVariables>;
export const CreateCustomerNoteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateCustomerNote"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"customerUid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"message"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"followUp"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Date"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"assignedTo"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"type"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createCustomerNote"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"customerUid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"customerUid"}}},{"kind":"Argument","name":{"kind":"Name","value":"message"},"value":{"kind":"Variable","name":{"kind":"Name","value":"message"}}},{"kind":"Argument","name":{"kind":"Name","value":"followUp"},"value":{"kind":"Variable","name":{"kind":"Name","value":"followUp"}}},{"kind":"Argument","name":{"kind":"Name","value":"assignedTo"},"value":{"kind":"Variable","name":{"kind":"Name","value":"assignedTo"}}},{"kind":"Argument","name":{"kind":"Name","value":"type"},"value":{"kind":"Variable","name":{"kind":"Name","value":"type"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"customerUid"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"followUp"}},{"kind":"Field","name":{"kind":"Name","value":"assignedTo"}},{"kind":"Field","name":{"kind":"Name","value":"assignedToUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"noteTypeDetails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"color"}}]}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"}},{"kind":"Field","name":{"kind":"Name","value":"createdByName"}}]}}]}}]} as unknown as DocumentNode<CreateCustomerNoteMutation, CreateCustomerNoteMutationVariables>;
export const DeleteCustomerNoteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteCustomerNote"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteCustomerNote"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uid"}}}]}]}}]} as unknown as DocumentNode<DeleteCustomerNoteMutation, DeleteCustomerNoteMutationVariables>;
export const CreateNoteTypeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateNoteType"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"color"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createNoteType"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"color"},"value":{"kind":"Variable","name":{"kind":"Name","value":"color"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"}}]}}]}}]} as unknown as DocumentNode<CreateNoteTypeMutation, CreateNoteTypeMutationVariables>;
export const DeleteNoteTypeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteNoteType"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteNoteType"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uid"}}}]}]}}]} as unknown as DocumentNode<DeleteNoteTypeMutation, DeleteNoteTypeMutationVariables>;
export const UpdateNoteTypeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateNoteType"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"color"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"isActive"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateNoteType"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uid"}}},{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"color"},"value":{"kind":"Variable","name":{"kind":"Name","value":"color"}}},{"kind":"Argument","name":{"kind":"Name","value":"isActive"},"value":{"kind":"Variable","name":{"kind":"Name","value":"isActive"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<UpdateNoteTypeMutation, UpdateNoteTypeMutationVariables>;
export const CreateNotificationEntityDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateNotificationEntity"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateNotificationEntityInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createNotificationEntity"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"fromEmail"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"userUids"}}]}}]}}]} as unknown as DocumentNode<CreateNotificationEntityMutation, CreateNotificationEntityMutationVariables>;
export const UpdateNotificationEntityDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateNotificationEntity"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateNotificationEntityInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateNotificationEntity"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uid"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"fromEmail"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"userUids"}}]}}]}}]} as unknown as DocumentNode<UpdateNotificationEntityMutation, UpdateNotificationEntityMutationVariables>;
export const DeleteNotificationEntityDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteNotificationEntity"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteNotificationEntity"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uid"}}}]}]}}]} as unknown as DocumentNode<DeleteNotificationEntityMutation, DeleteNotificationEntityMutationVariables>;
export const CreatePdfTermDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreatePdfTerm"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreatePdfTermInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createPdfTerm"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"rateType"}},{"kind":"Field","name":{"kind":"Name","value":"rateUids"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<CreatePdfTermMutation, CreatePdfTermMutationVariables>;
export const UpdatePdfTermDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdatePdfTerm"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdatePdfTermInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updatePdfTerm"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uid"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"rateType"}},{"kind":"Field","name":{"kind":"Name","value":"rateUids"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<UpdatePdfTermMutation, UpdatePdfTermMutationVariables>;
export const SoftDeletePdfTermDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SoftDeletePdfTerm"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"softDeletePdfTerm"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uid"}}}]}]}}]} as unknown as DocumentNode<SoftDeletePdfTermMutation, SoftDeletePdfTermMutationVariables>;
export const RestorePdfTermDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RestorePdfTerm"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"restorePdfTerm"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uid"}}}]}]}}]} as unknown as DocumentNode<RestorePdfTermMutation, RestorePdfTermMutationVariables>;
export const UpdatePermissionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdatePermission"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"roleUid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"menuUid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdatePermissionInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updatePermission"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"roleUid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"roleUid"}}},{"kind":"Argument","name":{"kind":"Name","value":"menuUid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"menuUid"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"roleUid"}},{"kind":"Field","name":{"kind":"Name","value":"menuUid"}},{"kind":"Field","name":{"kind":"Name","value":"canView"}},{"kind":"Field","name":{"kind":"Name","value":"canCreate"}},{"kind":"Field","name":{"kind":"Name","value":"canEdit"}},{"kind":"Field","name":{"kind":"Name","value":"canDelete"}}]}}]}}]} as unknown as DocumentNode<UpdatePermissionMutation, UpdatePermissionMutationVariables>;
export const UpdatePermissionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdatePermissions"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdatePermissionsInput"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updatePermissions"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"roleUid"}},{"kind":"Field","name":{"kind":"Name","value":"menuUid"}},{"kind":"Field","name":{"kind":"Name","value":"canView"}},{"kind":"Field","name":{"kind":"Name","value":"canCreate"}},{"kind":"Field","name":{"kind":"Name","value":"canEdit"}},{"kind":"Field","name":{"kind":"Name","value":"canDelete"}}]}}]}}]}}]} as unknown as DocumentNode<UpdatePermissionsMutation, UpdatePermissionsMutationVariables>;
export const UpsertRoleFeaturePermissionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpsertRoleFeaturePermission"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"roleUid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"featureUid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"isEnabled"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"upsertRoleFeaturePermission"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"roleUid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"roleUid"}}},{"kind":"Argument","name":{"kind":"Name","value":"featureUid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"featureUid"}}},{"kind":"Argument","name":{"kind":"Name","value":"isEnabled"},"value":{"kind":"Variable","name":{"kind":"Name","value":"isEnabled"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"roleUid"}},{"kind":"Field","name":{"kind":"Name","value":"featureUid"}},{"kind":"Field","name":{"kind":"Name","value":"isEnabled"}}]}}]}}]} as unknown as DocumentNode<UpsertRoleFeaturePermissionMutation, UpsertRoleFeaturePermissionMutationVariables>;
export const CreateRatePlanDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateRatePlan"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateRatePlanInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createRatePlan"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"RatePlanFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RatePlanFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"RatePlan"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"tenant"}},{"kind":"Field","name":{"kind":"Name","value":"codes"}},{"kind":"Field","name":{"kind":"Name","value":"planId"}},{"kind":"Field","name":{"kind":"Name","value":"dnsp"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"tariff"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"vpp"}},{"kind":"Field","name":{"kind":"Name","value":"discountApplies"}},{"kind":"Field","name":{"kind":"Name","value":"discountPercentage"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"}},{"kind":"Field","name":{"kind":"Name","value":"updatedBy"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]} as unknown as DocumentNode<CreateRatePlanMutation, CreateRatePlanMutationVariables>;
export const UpdateRatePlanDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateRatePlan"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateRatePlanInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateRatePlan"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uid"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"RatePlanFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RatePlanFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"RatePlan"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"tenant"}},{"kind":"Field","name":{"kind":"Name","value":"codes"}},{"kind":"Field","name":{"kind":"Name","value":"planId"}},{"kind":"Field","name":{"kind":"Name","value":"dnsp"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"tariff"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"vpp"}},{"kind":"Field","name":{"kind":"Name","value":"discountApplies"}},{"kind":"Field","name":{"kind":"Name","value":"discountPercentage"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"}},{"kind":"Field","name":{"kind":"Name","value":"updatedBy"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]} as unknown as DocumentNode<UpdateRatePlanMutation, UpdateRatePlanMutationVariables>;
export const DeleteRatePlanDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteRatePlan"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hardDeleteRatePlan"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uid"}}}]}]}}]} as unknown as DocumentNode<DeleteRatePlanMutation, DeleteRatePlanMutationVariables>;
export const SoftDeleteRatePlanDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SoftDeleteRatePlan"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"softDeleteRatePlan"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uid"}}}]}]}}]} as unknown as DocumentNode<SoftDeleteRatePlanMutation, SoftDeleteRatePlanMutationVariables>;
export const RestoreRatePlanDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RestoreRatePlan"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"restoreRatePlan"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uid"}}}]}]}}]} as unknown as DocumentNode<RestoreRatePlanMutation, RestoreRatePlanMutationVariables>;
export const CreateRateOfferDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateRateOffer"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateRateOfferInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createRateOffer"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"RateOfferFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RateOfferFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"RateOffer"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"ratePlanUid"}},{"kind":"Field","name":{"kind":"Name","value":"tenant"}},{"kind":"Field","name":{"kind":"Name","value":"offerName"}},{"kind":"Field","name":{"kind":"Name","value":"anytime"}},{"kind":"Field","name":{"kind":"Name","value":"cl1Supply"}},{"kind":"Field","name":{"kind":"Name","value":"cl1Usage"}},{"kind":"Field","name":{"kind":"Name","value":"cl2Supply"}},{"kind":"Field","name":{"kind":"Name","value":"cl2Usage"}},{"kind":"Field","name":{"kind":"Name","value":"demand"}},{"kind":"Field","name":{"kind":"Name","value":"demandOp"}},{"kind":"Field","name":{"kind":"Name","value":"demandP"}},{"kind":"Field","name":{"kind":"Name","value":"demandS"}},{"kind":"Field","name":{"kind":"Name","value":"fit"}},{"kind":"Field","name":{"kind":"Name","value":"fitPeak"}},{"kind":"Field","name":{"kind":"Name","value":"fitCritical"}},{"kind":"Field","name":{"kind":"Name","value":"fitVpp"}},{"kind":"Field","name":{"kind":"Name","value":"offPeak"}},{"kind":"Field","name":{"kind":"Name","value":"peak"}},{"kind":"Field","name":{"kind":"Name","value":"shoulder"}},{"kind":"Field","name":{"kind":"Name","value":"supplyCharge"}},{"kind":"Field","name":{"kind":"Name","value":"vppOrcharge"}},{"kind":"Field","name":{"kind":"Name","value":"dynamicRates"}},{"kind":"Field","name":{"kind":"Name","value":"priceUnits"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"}},{"kind":"Field","name":{"kind":"Name","value":"updatedBy"}}]}}]} as unknown as DocumentNode<CreateRateOfferMutation, CreateRateOfferMutationVariables>;
export const UpdateRateOfferDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateRateOffer"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateRateOfferInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateRateOffer"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uid"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"RateOfferFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RateOfferFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"RateOffer"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"ratePlanUid"}},{"kind":"Field","name":{"kind":"Name","value":"tenant"}},{"kind":"Field","name":{"kind":"Name","value":"offerName"}},{"kind":"Field","name":{"kind":"Name","value":"anytime"}},{"kind":"Field","name":{"kind":"Name","value":"cl1Supply"}},{"kind":"Field","name":{"kind":"Name","value":"cl1Usage"}},{"kind":"Field","name":{"kind":"Name","value":"cl2Supply"}},{"kind":"Field","name":{"kind":"Name","value":"cl2Usage"}},{"kind":"Field","name":{"kind":"Name","value":"demand"}},{"kind":"Field","name":{"kind":"Name","value":"demandOp"}},{"kind":"Field","name":{"kind":"Name","value":"demandP"}},{"kind":"Field","name":{"kind":"Name","value":"demandS"}},{"kind":"Field","name":{"kind":"Name","value":"fit"}},{"kind":"Field","name":{"kind":"Name","value":"fitPeak"}},{"kind":"Field","name":{"kind":"Name","value":"fitCritical"}},{"kind":"Field","name":{"kind":"Name","value":"fitVpp"}},{"kind":"Field","name":{"kind":"Name","value":"offPeak"}},{"kind":"Field","name":{"kind":"Name","value":"peak"}},{"kind":"Field","name":{"kind":"Name","value":"shoulder"}},{"kind":"Field","name":{"kind":"Name","value":"supplyCharge"}},{"kind":"Field","name":{"kind":"Name","value":"vppOrcharge"}},{"kind":"Field","name":{"kind":"Name","value":"dynamicRates"}},{"kind":"Field","name":{"kind":"Name","value":"priceUnits"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"}},{"kind":"Field","name":{"kind":"Name","value":"updatedBy"}}]}}]} as unknown as DocumentNode<UpdateRateOfferMutation, UpdateRateOfferMutationVariables>;
export const DeleteRateOfferDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteRateOffer"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hardDeleteRateOffer"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uid"}}}]}]}}]} as unknown as DocumentNode<DeleteRateOfferMutation, DeleteRateOfferMutationVariables>;
export const CreateRatesSnapshotDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateRatesSnapshot"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"ratePlanUid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"action"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createRatesSnapshot"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"ratePlanUid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ratePlanUid"}}},{"kind":"Argument","name":{"kind":"Name","value":"action"},"value":{"kind":"Variable","name":{"kind":"Name","value":"action"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"ratePlanUid"}},{"kind":"Field","name":{"kind":"Name","value":"auditAction"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"}},{"kind":"Field","name":{"kind":"Name","value":"createdByName"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<CreateRatesSnapshotMutation, CreateRatesSnapshotMutationVariables>;
export const SetActiveRatesVersionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SetActiveRatesVersion"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"setActiveRatesVersion"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uid"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"version"}},{"kind":"Field","name":{"kind":"Name","value":"activeVersion"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdByName"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<SetActiveRatesVersionMutation, SetActiveRatesVersionMutationVariables>;
export const RestoreRatesSnapshotDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RestoreRatesSnapshot"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"historyUid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"restoreRatesSnapshot"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"historyUid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"historyUid"}}}]}]}}]} as unknown as DocumentNode<RestoreRatesSnapshotMutation, RestoreRatesSnapshotMutationVariables>;
export const UpdateRatePlansDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateRatePlans"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"inputs"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateRatePlanWithUidInput"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateRatePlans"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"inputs"},"value":{"kind":"Variable","name":{"kind":"Name","value":"inputs"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"RatePlanFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RatePlanFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"RatePlan"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"tenant"}},{"kind":"Field","name":{"kind":"Name","value":"codes"}},{"kind":"Field","name":{"kind":"Name","value":"planId"}},{"kind":"Field","name":{"kind":"Name","value":"dnsp"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"tariff"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"vpp"}},{"kind":"Field","name":{"kind":"Name","value":"discountApplies"}},{"kind":"Field","name":{"kind":"Name","value":"discountPercentage"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"}},{"kind":"Field","name":{"kind":"Name","value":"updatedBy"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]} as unknown as DocumentNode<UpdateRatePlansMutation, UpdateRatePlansMutationVariables>;
export const CreateMeasurementUnitDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateMeasurementUnit"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createMeasurementUnit"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<CreateMeasurementUnitMutation, CreateMeasurementUnitMutationVariables>;
export const DeleteMeasurementUnitDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteMeasurementUnit"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteMeasurementUnit"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uid"}}}]}]}}]} as unknown as DocumentNode<DeleteMeasurementUnitMutation, DeleteMeasurementUnitMutationVariables>;
export const CreateRiskStatusDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateRiskStatus"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"code"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"description"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"color"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"scoreMin"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"scoreMax"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"manualOffer"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sortOrder"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createRiskStatus"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"code"},"value":{"kind":"Variable","name":{"kind":"Name","value":"code"}}},{"kind":"Argument","name":{"kind":"Name","value":"description"},"value":{"kind":"Variable","name":{"kind":"Name","value":"description"}}},{"kind":"Argument","name":{"kind":"Name","value":"color"},"value":{"kind":"Variable","name":{"kind":"Name","value":"color"}}},{"kind":"Argument","name":{"kind":"Name","value":"scoreMin"},"value":{"kind":"Variable","name":{"kind":"Name","value":"scoreMin"}}},{"kind":"Argument","name":{"kind":"Name","value":"scoreMax"},"value":{"kind":"Variable","name":{"kind":"Name","value":"scoreMax"}}},{"kind":"Argument","name":{"kind":"Name","value":"manualOffer"},"value":{"kind":"Variable","name":{"kind":"Name","value":"manualOffer"}}},{"kind":"Argument","name":{"kind":"Name","value":"sortOrder"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sortOrder"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"scoreMin"}},{"kind":"Field","name":{"kind":"Name","value":"scoreMax"}},{"kind":"Field","name":{"kind":"Name","value":"manualOffer"}},{"kind":"Field","name":{"kind":"Name","value":"sortOrder"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}}]}}]}}]} as unknown as DocumentNode<CreateRiskStatusMutation, CreateRiskStatusMutationVariables>;
export const UpdateRiskStatusDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateRiskStatus"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"code"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"description"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"color"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"scoreMin"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"scoreMax"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"manualOffer"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sortOrder"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"isActive"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateRiskStatus"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uid"}}},{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"code"},"value":{"kind":"Variable","name":{"kind":"Name","value":"code"}}},{"kind":"Argument","name":{"kind":"Name","value":"description"},"value":{"kind":"Variable","name":{"kind":"Name","value":"description"}}},{"kind":"Argument","name":{"kind":"Name","value":"color"},"value":{"kind":"Variable","name":{"kind":"Name","value":"color"}}},{"kind":"Argument","name":{"kind":"Name","value":"scoreMin"},"value":{"kind":"Variable","name":{"kind":"Name","value":"scoreMin"}}},{"kind":"Argument","name":{"kind":"Name","value":"scoreMax"},"value":{"kind":"Variable","name":{"kind":"Name","value":"scoreMax"}}},{"kind":"Argument","name":{"kind":"Name","value":"manualOffer"},"value":{"kind":"Variable","name":{"kind":"Name","value":"manualOffer"}}},{"kind":"Argument","name":{"kind":"Name","value":"sortOrder"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sortOrder"}}},{"kind":"Argument","name":{"kind":"Name","value":"isActive"},"value":{"kind":"Variable","name":{"kind":"Name","value":"isActive"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"scoreMin"}},{"kind":"Field","name":{"kind":"Name","value":"scoreMax"}},{"kind":"Field","name":{"kind":"Name","value":"manualOffer"}},{"kind":"Field","name":{"kind":"Name","value":"sortOrder"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}}]}}]}}]} as unknown as DocumentNode<UpdateRiskStatusMutation, UpdateRiskStatusMutationVariables>;
export const DeleteRiskStatusDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteRiskStatus"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteRiskStatus"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uid"}}}]}]}}]} as unknown as DocumentNode<DeleteRiskStatusMutation, DeleteRiskStatusMutationVariables>;
export const CreateRoleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateRole"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateRoleInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createRole"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<CreateRoleMutation, CreateRoleMutationVariables>;
export const UpdateRoleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateRole"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateRoleInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateRole"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uid"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<UpdateRoleMutation, UpdateRoleMutationVariables>;
export const SoftDeleteRoleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SoftDeleteRole"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"softDeleteRole"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uid"}}}]}]}}]} as unknown as DocumentNode<SoftDeleteRoleMutation, SoftDeleteRoleMutationVariables>;
export const RestoreRoleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RestoreRole"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"restoreRole"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uid"}}}]}]}}]} as unknown as DocumentNode<RestoreRoleMutation, RestoreRoleMutationVariables>;
export const UpsertUserPermissionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpsertUserPermission"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpsertUserPermissionInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"upsertUserPermission"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userUid"}},{"kind":"Field","name":{"kind":"Name","value":"menuUid"}},{"kind":"Field","name":{"kind":"Name","value":"canView"}},{"kind":"Field","name":{"kind":"Name","value":"canCreate"}},{"kind":"Field","name":{"kind":"Name","value":"canEdit"}},{"kind":"Field","name":{"kind":"Name","value":"canDelete"}}]}}]}}]} as unknown as DocumentNode<UpsertUserPermissionMutation, UpsertUserPermissionMutationVariables>;
export const UpsertUserFeaturePermissionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpsertUserFeaturePermission"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpsertUserFeaturePermissionInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"upsertUserFeaturePermission"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userUid"}},{"kind":"Field","name":{"kind":"Name","value":"featureUid"}},{"kind":"Field","name":{"kind":"Name","value":"isEnabled"}}]}}]}}]} as unknown as DocumentNode<UpsertUserFeaturePermissionMutation, UpsertUserFeaturePermissionMutationVariables>;
export const CreateUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateUserInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"password"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"tenant"}},{"kind":"Field","name":{"kind":"Name","value":"roleUid"}},{"kind":"Field","name":{"kind":"Name","value":"roleName"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]} as unknown as DocumentNode<CreateUserMutation, CreateUserMutationVariables>;
export const UpdateUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateUserInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uid"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"password"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"tenant"}},{"kind":"Field","name":{"kind":"Name","value":"roleUid"}},{"kind":"Field","name":{"kind":"Name","value":"roleName"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]} as unknown as DocumentNode<UpdateUserMutation, UpdateUserMutationVariables>;
export const SoftDeleteUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SoftDeleteUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"softDeleteUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uid"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<SoftDeleteUserMutation, SoftDeleteUserMutationVariables>;
export const RestoreUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RestoreUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"restoreUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uid"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<RestoreUserMutation, RestoreUserMutationVariables>;
export const ChangePasswordDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ChangePassword"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ChangePasswordInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"changePassword"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<ChangePasswordMutation, ChangePasswordMutationVariables>;
export const AuditLogsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AuditLogs"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"tableName"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"recordId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"auditLogs"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"tableName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"tableName"}}},{"kind":"Argument","name":{"kind":"Name","value":"recordId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"recordId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"meta"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalRecords"}},{"kind":"Field","name":{"kind":"Name","value":"currentPage"}},{"kind":"Field","name":{"kind":"Name","value":"totalPages"}},{"kind":"Field","name":{"kind":"Name","value":"recordsPerPage"}}]}},{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"tableName"}},{"kind":"Field","name":{"kind":"Name","value":"recordId"}},{"kind":"Field","name":{"kind":"Name","value":"operation"}},{"kind":"Field","name":{"kind":"Name","value":"oldValues"}},{"kind":"Field","name":{"kind":"Name","value":"newValues"}},{"kind":"Field","name":{"kind":"Name","value":"changedAt"}},{"kind":"Field","name":{"kind":"Name","value":"changedBy"}}]}}]}}]}}]} as unknown as DocumentNode<AuditLogsQuery, AuditLogsQueryVariables>;
export const AuditLogDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AuditLog"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"auditLog"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uid"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"tableName"}},{"kind":"Field","name":{"kind":"Name","value":"recordId"}},{"kind":"Field","name":{"kind":"Name","value":"operation"}},{"kind":"Field","name":{"kind":"Name","value":"oldValues"}},{"kind":"Field","name":{"kind":"Name","value":"newValues"}},{"kind":"Field","name":{"kind":"Name","value":"changedAt"}},{"kind":"Field","name":{"kind":"Name","value":"changedBy"}}]}}]}}]} as unknown as DocumentNode<AuditLogQuery, AuditLogQueryVariables>;
export const RecordAuditHistoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"RecordAuditHistory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"tableName"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"recordId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"recordAuditHistory"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"tableName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"tableName"}}},{"kind":"Argument","name":{"kind":"Name","value":"recordId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"recordId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tableName"}},{"kind":"Field","name":{"kind":"Name","value":"recordId"}},{"kind":"Field","name":{"kind":"Name","value":"currentRecord"}},{"kind":"Field","name":{"kind":"Name","value":"auditHistory"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"operation"}},{"kind":"Field","name":{"kind":"Name","value":"oldValues"}},{"kind":"Field","name":{"kind":"Name","value":"newValues"}},{"kind":"Field","name":{"kind":"Name","value":"changedAt"}},{"kind":"Field","name":{"kind":"Name","value":"changedBy"}}]}}]}}]}}]} as unknown as DocumentNode<RecordAuditHistoryQuery, RecordAuditHistoryQueryVariables>;
export const MeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"tenant"}},{"kind":"Field","name":{"kind":"Name","value":"roleUid"}},{"kind":"Field","name":{"kind":"Name","value":"roleName"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"accessibleMenus"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"menuUid"}},{"kind":"Field","name":{"kind":"Name","value":"menuName"}},{"kind":"Field","name":{"kind":"Name","value":"menuCode"}},{"kind":"Field","name":{"kind":"Name","value":"parentUid"}},{"kind":"Field","name":{"kind":"Name","value":"canView"}},{"kind":"Field","name":{"kind":"Name","value":"canCreate"}},{"kind":"Field","name":{"kind":"Name","value":"canEdit"}},{"kind":"Field","name":{"kind":"Name","value":"canDelete"}},{"kind":"Field","name":{"kind":"Name","value":"sortOrder"}}]}},{"kind":"Field","name":{"kind":"Name","value":"accessibleFeatures"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"featureUid"}},{"kind":"Field","name":{"kind":"Name","value":"featureCode"}},{"kind":"Field","name":{"kind":"Name","value":"featureName"}},{"kind":"Field","name":{"kind":"Name","value":"isEnabled"}}]}}]}}]}}]} as unknown as DocumentNode<MeQuery, MeQueryVariables>;
export const CustomersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Customers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"customers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"customerId"}},{"kind":"Field","name":{"kind":"Name","value":"tenant"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"businessName"}},{"kind":"Field","name":{"kind":"Name","value":"abn"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"dob"}},{"kind":"Field","name":{"kind":"Name","value":"phoneVerifiedAt"}},{"kind":"Field","name":{"kind":"Name","value":"propertyType"}},{"kind":"Field","name":{"kind":"Name","value":"tariffCode"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"utilmateStatus"}},{"kind":"Field","name":{"kind":"Name","value":"utilmateUpdatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"utilmateUploadedManually"}},{"kind":"Field","name":{"kind":"Name","value":"gender"}},{"kind":"Field","name":{"kind":"Name","value":"relationshipStatus"}},{"kind":"Field","name":{"kind":"Name","value":"enquiryAmount"}},{"kind":"Field","name":{"kind":"Name","value":"checkCreditScore"}},{"kind":"Field","name":{"kind":"Name","value":"employerName"}},{"kind":"Field","name":{"kind":"Name","value":"riskStatus"}},{"kind":"Field","name":{"kind":"Name","value":"signDate"}},{"kind":"Field","name":{"kind":"Name","value":"signedPdfPath"}},{"kind":"Field","name":{"kind":"Name","value":"pdfAudit"}},{"kind":"Field","name":{"kind":"Name","value":"emailSent"}},{"kind":"Field","name":{"kind":"Name","value":"discount"}},{"kind":"Field","name":{"kind":"Name","value":"previousCustomerUid"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"offerEmailSentAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"previousBill"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"filename"}},{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"size"}},{"kind":"Field","name":{"kind":"Name","value":"mimeType"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"}},{"kind":"Field","name":{"kind":"Name","value":"createdByUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"identityProof"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"filename"}},{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"size"}},{"kind":"Field","name":{"kind":"Name","value":"mimeType"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"}},{"kind":"Field","name":{"kind":"Name","value":"createdByUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"}},{"kind":"Field","name":{"kind":"Name","value":"updatedBy"}},{"kind":"Field","name":{"kind":"Name","value":"deletedBy"}},{"kind":"Field","name":{"kind":"Name","value":"ratePlan"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"tenant"}},{"kind":"Field","name":{"kind":"Name","value":"codes"}},{"kind":"Field","name":{"kind":"Name","value":"planId"}},{"kind":"Field","name":{"kind":"Name","value":"dnsp"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"tariff"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"vpp"}},{"kind":"Field","name":{"kind":"Name","value":"discountApplies"}},{"kind":"Field","name":{"kind":"Name","value":"discountPercentage"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"}},{"kind":"Field","name":{"kind":"Name","value":"updatedBy"}},{"kind":"Field","name":{"kind":"Name","value":"deletedBy"}},{"kind":"Field","name":{"kind":"Name","value":"offers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"ratePlanUid"}},{"kind":"Field","name":{"kind":"Name","value":"tenant"}},{"kind":"Field","name":{"kind":"Name","value":"offerName"}},{"kind":"Field","name":{"kind":"Name","value":"anytime"}},{"kind":"Field","name":{"kind":"Name","value":"cl1Supply"}},{"kind":"Field","name":{"kind":"Name","value":"cl1Usage"}},{"kind":"Field","name":{"kind":"Name","value":"cl2Supply"}},{"kind":"Field","name":{"kind":"Name","value":"cl2Usage"}},{"kind":"Field","name":{"kind":"Name","value":"demand"}},{"kind":"Field","name":{"kind":"Name","value":"demandOp"}},{"kind":"Field","name":{"kind":"Name","value":"demandP"}},{"kind":"Field","name":{"kind":"Name","value":"demandS"}},{"kind":"Field","name":{"kind":"Name","value":"fit"}},{"kind":"Field","name":{"kind":"Name","value":"fitPeak"}},{"kind":"Field","name":{"kind":"Name","value":"fitCritical"}},{"kind":"Field","name":{"kind":"Name","value":"fitVpp"}},{"kind":"Field","name":{"kind":"Name","value":"offPeak"}},{"kind":"Field","name":{"kind":"Name","value":"peak"}},{"kind":"Field","name":{"kind":"Name","value":"shoulder"}},{"kind":"Field","name":{"kind":"Name","value":"supplyCharge"}},{"kind":"Field","name":{"kind":"Name","value":"vppOrcharge"}},{"kind":"Field","name":{"kind":"Name","value":"dynamicRates"}},{"kind":"Field","name":{"kind":"Name","value":"priceUnits"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"}},{"kind":"Field","name":{"kind":"Name","value":"updatedBy"}},{"kind":"Field","name":{"kind":"Name","value":"deletedBy"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"enrollmentDetails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"customerUid"}},{"kind":"Field","name":{"kind":"Name","value":"saletype"}},{"kind":"Field","name":{"kind":"Name","value":"connectiondate"}},{"kind":"Field","name":{"kind":"Name","value":"idtype"}},{"kind":"Field","name":{"kind":"Name","value":"idnumber"}},{"kind":"Field","name":{"kind":"Name","value":"idstate"}},{"kind":"Field","name":{"kind":"Name","value":"idcountry"}},{"kind":"Field","name":{"kind":"Name","value":"idexpiry"}},{"kind":"Field","name":{"kind":"Name","value":"concession"}},{"kind":"Field","name":{"kind":"Name","value":"lifesupport"}},{"kind":"Field","name":{"kind":"Name","value":"billingpreference"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"address"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"customerUid"}},{"kind":"Field","name":{"kind":"Name","value":"unitNumber"}},{"kind":"Field","name":{"kind":"Name","value":"streetNumber"}},{"kind":"Field","name":{"kind":"Name","value":"streetName"}},{"kind":"Field","name":{"kind":"Name","value":"streetType"}},{"kind":"Field","name":{"kind":"Name","value":"suburb"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"postcode"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"nmi"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"solarDetails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"customerUid"}},{"kind":"Field","name":{"kind":"Name","value":"hassolar"}},{"kind":"Field","name":{"kind":"Name","value":"solarcapacity"}},{"kind":"Field","name":{"kind":"Name","value":"invertercapacity"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"batteryDetails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"customerUid"}},{"kind":"Field","name":{"kind":"Name","value":"batterybrand"}},{"kind":"Field","name":{"kind":"Name","value":"snnumber"}},{"kind":"Field","name":{"kind":"Name","value":"batterycapacity"}},{"kind":"Field","name":{"kind":"Name","value":"exportlimit"}},{"kind":"Field","name":{"kind":"Name","value":"inverterCapacity"}},{"kind":"Field","name":{"kind":"Name","value":"checkCode"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"msatDetails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"customerUid"}},{"kind":"Field","name":{"kind":"Name","value":"msatConnected"}},{"kind":"Field","name":{"kind":"Name","value":"msatConnectedAt"}},{"kind":"Field","name":{"kind":"Name","value":"msatUpdatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"vppDetails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"customerUid"}},{"kind":"Field","name":{"kind":"Name","value":"vpp"}},{"kind":"Field","name":{"kind":"Name","value":"vppConnected"}},{"kind":"Field","name":{"kind":"Name","value":"vppSignupBonus"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"history"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"version"}},{"kind":"Field","name":{"kind":"Name","value":"customerSnapshot"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"meta"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalRecords"}},{"kind":"Field","name":{"kind":"Name","value":"currentPage"}},{"kind":"Field","name":{"kind":"Name","value":"totalPages"}},{"kind":"Field","name":{"kind":"Name","value":"recordsPerPage"}}]}}]}}]}}]} as unknown as DocumentNode<CustomersQuery, CustomersQueryVariables>;
export const CustomersListDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CustomersList"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"customers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"customerId"}},{"kind":"Field","name":{"kind":"Name","value":"tenant"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"businessName"}},{"kind":"Field","name":{"kind":"Name","value":"abn"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"dob"}},{"kind":"Field","name":{"kind":"Name","value":"phoneVerifiedAt"}},{"kind":"Field","name":{"kind":"Name","value":"propertyType"}},{"kind":"Field","name":{"kind":"Name","value":"tariffCode"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"utilmateStatus"}},{"kind":"Field","name":{"kind":"Name","value":"utilmateUpdatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"utilmateUploadedManually"}},{"kind":"Field","name":{"kind":"Name","value":"gender"}},{"kind":"Field","name":{"kind":"Name","value":"relationshipStatus"}},{"kind":"Field","name":{"kind":"Name","value":"enquiryAmount"}},{"kind":"Field","name":{"kind":"Name","value":"checkCreditScore"}},{"kind":"Field","name":{"kind":"Name","value":"employerName"}},{"kind":"Field","name":{"kind":"Name","value":"riskStatus"}},{"kind":"Field","name":{"kind":"Name","value":"signDate"}},{"kind":"Field","name":{"kind":"Name","value":"signedPdfPath"}},{"kind":"Field","name":{"kind":"Name","value":"pdfAudit"}},{"kind":"Field","name":{"kind":"Name","value":"emailSent"}},{"kind":"Field","name":{"kind":"Name","value":"discount"}},{"kind":"Field","name":{"kind":"Name","value":"previousCustomerUid"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"previousBill"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"filename"}},{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"size"}},{"kind":"Field","name":{"kind":"Name","value":"mimeType"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"}},{"kind":"Field","name":{"kind":"Name","value":"createdByUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"identityProof"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"filename"}},{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"size"}},{"kind":"Field","name":{"kind":"Name","value":"mimeType"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"}},{"kind":"Field","name":{"kind":"Name","value":"createdByUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"}},{"kind":"Field","name":{"kind":"Name","value":"updatedBy"}},{"kind":"Field","name":{"kind":"Name","value":"deletedBy"}},{"kind":"Field","name":{"kind":"Name","value":"ratePlan"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"tenant"}},{"kind":"Field","name":{"kind":"Name","value":"codes"}},{"kind":"Field","name":{"kind":"Name","value":"planId"}},{"kind":"Field","name":{"kind":"Name","value":"dnsp"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"tariff"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"vpp"}},{"kind":"Field","name":{"kind":"Name","value":"discountApplies"}},{"kind":"Field","name":{"kind":"Name","value":"discountPercentage"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"}},{"kind":"Field","name":{"kind":"Name","value":"updatedBy"}},{"kind":"Field","name":{"kind":"Name","value":"deletedBy"}}]}},{"kind":"Field","name":{"kind":"Name","value":"address"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"customerUid"}},{"kind":"Field","name":{"kind":"Name","value":"unitNumber"}},{"kind":"Field","name":{"kind":"Name","value":"streetNumber"}},{"kind":"Field","name":{"kind":"Name","value":"streetName"}},{"kind":"Field","name":{"kind":"Name","value":"streetType"}},{"kind":"Field","name":{"kind":"Name","value":"suburb"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"postcode"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"nmi"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"solarDetails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"customerUid"}},{"kind":"Field","name":{"kind":"Name","value":"hassolar"}},{"kind":"Field","name":{"kind":"Name","value":"solarcapacity"}},{"kind":"Field","name":{"kind":"Name","value":"invertercapacity"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"vppDetails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"customerUid"}},{"kind":"Field","name":{"kind":"Name","value":"vpp"}},{"kind":"Field","name":{"kind":"Name","value":"vppConnected"}},{"kind":"Field","name":{"kind":"Name","value":"vppSignupBonus"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"meta"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalRecords"}},{"kind":"Field","name":{"kind":"Name","value":"currentPage"}},{"kind":"Field","name":{"kind":"Name","value":"totalPages"}},{"kind":"Field","name":{"kind":"Name","value":"recordsPerPage"}}]}}]}}]}}]} as unknown as DocumentNode<CustomersListQuery, CustomersListQueryVariables>;
export const GetAllFilteredCustomerIdsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAllFilteredCustomerIds"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"searchId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"searchName"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"searchMobile"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"searchAddress"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"searchTariff"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"searchDnsp"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"searchDiscount"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"searchStatus"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"searchVpp"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"searchVppConnected"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"searchUtilmateStatus"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"searchMsatConnected"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"searchRiskStatus"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"includeDeleted"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"customersCursor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"10000"}},{"kind":"Argument","name":{"kind":"Name","value":"searchId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchId"}}},{"kind":"Argument","name":{"kind":"Name","value":"searchName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchName"}}},{"kind":"Argument","name":{"kind":"Name","value":"searchMobile"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchMobile"}}},{"kind":"Argument","name":{"kind":"Name","value":"searchAddress"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchAddress"}}},{"kind":"Argument","name":{"kind":"Name","value":"searchTariff"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchTariff"}}},{"kind":"Argument","name":{"kind":"Name","value":"searchDnsp"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchDnsp"}}},{"kind":"Argument","name":{"kind":"Name","value":"searchDiscount"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchDiscount"}}},{"kind":"Argument","name":{"kind":"Name","value":"searchStatus"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchStatus"}}},{"kind":"Argument","name":{"kind":"Name","value":"searchRiskStatus"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchRiskStatus"}}},{"kind":"Argument","name":{"kind":"Name","value":"searchVpp"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchVpp"}}},{"kind":"Argument","name":{"kind":"Name","value":"searchVppConnected"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchVppConnected"}}},{"kind":"Argument","name":{"kind":"Name","value":"searchUtilmateStatus"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchUtilmateStatus"}}},{"kind":"Argument","name":{"kind":"Name","value":"searchMsatConnected"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchMsatConnected"}}},{"kind":"Argument","name":{"kind":"Name","value":"includeDeleted"},"value":{"kind":"Variable","name":{"kind":"Name","value":"includeDeleted"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}}]}}]}}]}}]} as unknown as DocumentNode<GetAllFilteredCustomerIdsQuery, GetAllFilteredCustomerIdsQueryVariables>;
export const CustomersCursorDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CustomersCursor"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"search"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"discount"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"status"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"searchId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"searchName"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"searchMobile"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"searchAddress"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"searchTariff"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"searchDnsp"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"searchDiscount"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"searchStatus"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"searchRiskStatus"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"searchVpp"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"searchVppConnected"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"searchUtilmateStatus"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"searchMsatConnected"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"includeDeleted"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"customersCursor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after"}}},{"kind":"Argument","name":{"kind":"Name","value":"search"},"value":{"kind":"Variable","name":{"kind":"Name","value":"search"}}},{"kind":"Argument","name":{"kind":"Name","value":"discount"},"value":{"kind":"Variable","name":{"kind":"Name","value":"discount"}}},{"kind":"Argument","name":{"kind":"Name","value":"status"},"value":{"kind":"Variable","name":{"kind":"Name","value":"status"}}},{"kind":"Argument","name":{"kind":"Name","value":"searchId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchId"}}},{"kind":"Argument","name":{"kind":"Name","value":"searchName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchName"}}},{"kind":"Argument","name":{"kind":"Name","value":"searchMobile"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchMobile"}}},{"kind":"Argument","name":{"kind":"Name","value":"searchAddress"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchAddress"}}},{"kind":"Argument","name":{"kind":"Name","value":"searchTariff"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchTariff"}}},{"kind":"Argument","name":{"kind":"Name","value":"searchDnsp"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchDnsp"}}},{"kind":"Argument","name":{"kind":"Name","value":"searchDiscount"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchDiscount"}}},{"kind":"Argument","name":{"kind":"Name","value":"searchStatus"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchStatus"}}},{"kind":"Argument","name":{"kind":"Name","value":"searchRiskStatus"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchRiskStatus"}}},{"kind":"Argument","name":{"kind":"Name","value":"searchVpp"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchVpp"}}},{"kind":"Argument","name":{"kind":"Name","value":"searchVppConnected"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchVppConnected"}}},{"kind":"Argument","name":{"kind":"Name","value":"searchUtilmateStatus"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchUtilmateStatus"}}},{"kind":"Argument","name":{"kind":"Name","value":"searchMsatConnected"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchMsatConnected"}}},{"kind":"Argument","name":{"kind":"Name","value":"includeDeleted"},"value":{"kind":"Variable","name":{"kind":"Name","value":"includeDeleted"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"customerId"}},{"kind":"Field","name":{"kind":"Name","value":"tenant"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"propertyType"}},{"kind":"Field","name":{"kind":"Name","value":"tariffCode"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"utilmateStatus"}},{"kind":"Field","name":{"kind":"Name","value":"riskStatus"}},{"kind":"Field","name":{"kind":"Name","value":"msatDetails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"msatConnected"}}]}},{"kind":"Field","name":{"kind":"Name","value":"discount"}},{"kind":"Field","name":{"kind":"Name","value":"ratePlan"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"dnsp"}}]}},{"kind":"Field","name":{"kind":"Name","value":"vppDetails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"vpp"}},{"kind":"Field","name":{"kind":"Name","value":"vppConnected"}},{"kind":"Field","name":{"kind":"Name","value":"vppSignupBonus"}}]}},{"kind":"Field","name":{"kind":"Name","value":"utilmateDetails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"utilmateConnected"}}]}},{"kind":"Field","name":{"kind":"Name","value":"address"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fullAddress"}}]}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"hasPreviousPage"}},{"kind":"Field","name":{"kind":"Name","value":"startCursor"}},{"kind":"Field","name":{"kind":"Name","value":"startCursor"}},{"kind":"Field","name":{"kind":"Name","value":"endCursor"}},{"kind":"Field","name":{"kind":"Name","value":"totalCount"}}]}}]}}]}}]} as unknown as DocumentNode<CustomersCursorQuery, CustomersCursorQueryVariables>;
export const GetCustomerByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCustomerById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"customer"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uid"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"customerId"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"businessName"}},{"kind":"Field","name":{"kind":"Name","value":"abn"}},{"kind":"Field","name":{"kind":"Name","value":"showAsBusinessName"}},{"kind":"Field","name":{"kind":"Name","value":"showName"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"phoneVerifiedAt"}},{"kind":"Field","name":{"kind":"Name","value":"dob"}},{"kind":"Field","name":{"kind":"Name","value":"propertyType"}},{"kind":"Field","name":{"kind":"Name","value":"tariffCode"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"discount"}},{"kind":"Field","name":{"kind":"Name","value":"signDate"}},{"kind":"Field","name":{"kind":"Name","value":"signedPdfPath"}},{"kind":"Field","name":{"kind":"Name","value":"emailSent"}},{"kind":"Field","name":{"kind":"Name","value":"utilmateStatus"}},{"kind":"Field","name":{"kind":"Name","value":"rateVersion"}},{"kind":"Field","name":{"kind":"Name","value":"gender"}},{"kind":"Field","name":{"kind":"Name","value":"relationshipStatus"}},{"kind":"Field","name":{"kind":"Name","value":"enquiryAmount"}},{"kind":"Field","name":{"kind":"Name","value":"checkCreditScore"}},{"kind":"Field","name":{"kind":"Name","value":"employerName"}},{"kind":"Field","name":{"kind":"Name","value":"creditScore"}},{"kind":"Field","name":{"kind":"Name","value":"isCreditScoreFetched"}},{"kind":"Field","name":{"kind":"Name","value":"riskStatus"}},{"kind":"Field","name":{"kind":"Name","value":"emailLogCount"}},{"kind":"Field","name":{"kind":"Name","value":"offerVersion"}},{"kind":"Field","name":{"kind":"Name","value":"viewCode"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"offerEmailSentAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"address"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"customerUid"}},{"kind":"Field","name":{"kind":"Name","value":"unitNumber"}},{"kind":"Field","name":{"kind":"Name","value":"streetNumber"}},{"kind":"Field","name":{"kind":"Name","value":"streetName"}},{"kind":"Field","name":{"kind":"Name","value":"streetType"}},{"kind":"Field","name":{"kind":"Name","value":"suburb"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"postcode"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"nmi"}},{"kind":"Field","name":{"kind":"Name","value":"fullAddress"}}]}},{"kind":"Field","name":{"kind":"Name","value":"ratePlan"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"codes"}},{"kind":"Field","name":{"kind":"Name","value":"planId"}},{"kind":"Field","name":{"kind":"Name","value":"dnsp"}},{"kind":"Field","name":{"kind":"Name","value":"tariff"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"vpp"}},{"kind":"Field","name":{"kind":"Name","value":"discountApplies"}},{"kind":"Field","name":{"kind":"Name","value":"discountPercentage"}},{"kind":"Field","name":{"kind":"Name","value":"offers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"offerName"}},{"kind":"Field","name":{"kind":"Name","value":"anytime"}},{"kind":"Field","name":{"kind":"Name","value":"cl1Supply"}},{"kind":"Field","name":{"kind":"Name","value":"cl1Usage"}},{"kind":"Field","name":{"kind":"Name","value":"cl2Supply"}},{"kind":"Field","name":{"kind":"Name","value":"cl2Usage"}},{"kind":"Field","name":{"kind":"Name","value":"demand"}},{"kind":"Field","name":{"kind":"Name","value":"demandOp"}},{"kind":"Field","name":{"kind":"Name","value":"demandP"}},{"kind":"Field","name":{"kind":"Name","value":"demandS"}},{"kind":"Field","name":{"kind":"Name","value":"fit"}},{"kind":"Field","name":{"kind":"Name","value":"fitPeak"}},{"kind":"Field","name":{"kind":"Name","value":"fitCritical"}},{"kind":"Field","name":{"kind":"Name","value":"fitVpp"}},{"kind":"Field","name":{"kind":"Name","value":"offPeak"}},{"kind":"Field","name":{"kind":"Name","value":"peak"}},{"kind":"Field","name":{"kind":"Name","value":"shoulder"}},{"kind":"Field","name":{"kind":"Name","value":"supplyCharge"}},{"kind":"Field","name":{"kind":"Name","value":"vppOrcharge"}},{"kind":"Field","name":{"kind":"Name","value":"dynamicRates"}},{"kind":"Field","name":{"kind":"Name","value":"priceUnits"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"vppDetails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"vpp"}},{"kind":"Field","name":{"kind":"Name","value":"vppConnected"}},{"kind":"Field","name":{"kind":"Name","value":"vppSignupBonus"}}]}},{"kind":"Field","name":{"kind":"Name","value":"solarDetails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hassolar"}},{"kind":"Field","name":{"kind":"Name","value":"solarcapacity"}},{"kind":"Field","name":{"kind":"Name","value":"invertercapacity"}}]}},{"kind":"Field","name":{"kind":"Name","value":"batteryDetails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"batterybrand"}},{"kind":"Field","name":{"kind":"Name","value":"snnumber"}},{"kind":"Field","name":{"kind":"Name","value":"batterycapacity"}},{"kind":"Field","name":{"kind":"Name","value":"exportlimit"}},{"kind":"Field","name":{"kind":"Name","value":"inverterCapacity"}}]}},{"kind":"Field","name":{"kind":"Name","value":"enrollmentDetails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"saletype"}},{"kind":"Field","name":{"kind":"Name","value":"connectiondate"}},{"kind":"Field","name":{"kind":"Name","value":"idtype"}},{"kind":"Field","name":{"kind":"Name","value":"idnumber"}},{"kind":"Field","name":{"kind":"Name","value":"idstate"}},{"kind":"Field","name":{"kind":"Name","value":"idcountry"}},{"kind":"Field","name":{"kind":"Name","value":"idexpiry"}},{"kind":"Field","name":{"kind":"Name","value":"concession"}},{"kind":"Field","name":{"kind":"Name","value":"lifesupport"}},{"kind":"Field","name":{"kind":"Name","value":"billingpreference"}},{"kind":"Field","name":{"kind":"Name","value":"licenseNumber"}},{"kind":"Field","name":{"kind":"Name","value":"licenseState"}},{"kind":"Field","name":{"kind":"Name","value":"licenseExpiry"}}]}},{"kind":"Field","name":{"kind":"Name","value":"debitDetails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"optIn"}},{"kind":"Field","name":{"kind":"Name","value":"accountType"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"bankName"}},{"kind":"Field","name":{"kind":"Name","value":"bankAddress"}},{"kind":"Field","name":{"kind":"Name","value":"bsb"}},{"kind":"Field","name":{"kind":"Name","value":"accountNumber"}},{"kind":"Field","name":{"kind":"Name","value":"paymentFrequency"}},{"kind":"Field","name":{"kind":"Name","value":"firstDebitDate"}}]}},{"kind":"Field","name":{"kind":"Name","value":"utilmateDetails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"utilmateConnected"}}]}},{"kind":"Field","name":{"kind":"Name","value":"previousBill"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"filename"}},{"kind":"Field","name":{"kind":"Name","value":"path"}}]}},{"kind":"Field","name":{"kind":"Name","value":"identityProof"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"filename"}},{"kind":"Field","name":{"kind":"Name","value":"path"}}]}},{"kind":"Field","name":{"kind":"Name","value":"licenseDocument"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"filename"}},{"kind":"Field","name":{"kind":"Name","value":"path"}}]}}]}}]}}]} as unknown as DocumentNode<GetCustomerByIdQuery, GetCustomerByIdQueryVariables>;
export const GetCustomerGeneralDetailsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCustomerGeneralDetails"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"customer"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uid"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"customerId"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"businessName"}},{"kind":"Field","name":{"kind":"Name","value":"abn"}},{"kind":"Field","name":{"kind":"Name","value":"showAsBusinessName"}},{"kind":"Field","name":{"kind":"Name","value":"showName"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"phoneVerifiedAt"}},{"kind":"Field","name":{"kind":"Name","value":"dob"}},{"kind":"Field","name":{"kind":"Name","value":"propertyType"}},{"kind":"Field","name":{"kind":"Name","value":"tariffCode"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"discount"}},{"kind":"Field","name":{"kind":"Name","value":"signDate"}},{"kind":"Field","name":{"kind":"Name","value":"signedPdfPath"}},{"kind":"Field","name":{"kind":"Name","value":"emailSent"}},{"kind":"Field","name":{"kind":"Name","value":"utilmateStatus"}},{"kind":"Field","name":{"kind":"Name","value":"rateVersion"}},{"kind":"Field","name":{"kind":"Name","value":"gender"}},{"kind":"Field","name":{"kind":"Name","value":"relationshipStatus"}},{"kind":"Field","name":{"kind":"Name","value":"enquiryAmount"}},{"kind":"Field","name":{"kind":"Name","value":"checkCreditScore"}},{"kind":"Field","name":{"kind":"Name","value":"employerName"}},{"kind":"Field","name":{"kind":"Name","value":"creditScore"}},{"kind":"Field","name":{"kind":"Name","value":"isCreditScoreFetched"}},{"kind":"Field","name":{"kind":"Name","value":"riskStatus"}},{"kind":"Field","name":{"kind":"Name","value":"emailLogCount"}},{"kind":"Field","name":{"kind":"Name","value":"offerVersion"}},{"kind":"Field","name":{"kind":"Name","value":"viewCode"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"offerEmailSentAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"address"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"customerUid"}},{"kind":"Field","name":{"kind":"Name","value":"unitNumber"}},{"kind":"Field","name":{"kind":"Name","value":"streetNumber"}},{"kind":"Field","name":{"kind":"Name","value":"streetName"}},{"kind":"Field","name":{"kind":"Name","value":"streetType"}},{"kind":"Field","name":{"kind":"Name","value":"suburb"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"postcode"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"nmi"}},{"kind":"Field","name":{"kind":"Name","value":"fullAddress"}}]}},{"kind":"Field","name":{"kind":"Name","value":"ratePlan"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"codes"}},{"kind":"Field","name":{"kind":"Name","value":"planId"}},{"kind":"Field","name":{"kind":"Name","value":"dnsp"}},{"kind":"Field","name":{"kind":"Name","value":"tariff"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"vpp"}},{"kind":"Field","name":{"kind":"Name","value":"discountApplies"}},{"kind":"Field","name":{"kind":"Name","value":"discountPercentage"}},{"kind":"Field","name":{"kind":"Name","value":"offers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"offerName"}},{"kind":"Field","name":{"kind":"Name","value":"anytime"}},{"kind":"Field","name":{"kind":"Name","value":"cl1Supply"}},{"kind":"Field","name":{"kind":"Name","value":"cl1Usage"}},{"kind":"Field","name":{"kind":"Name","value":"cl2Supply"}},{"kind":"Field","name":{"kind":"Name","value":"cl2Usage"}},{"kind":"Field","name":{"kind":"Name","value":"demand"}},{"kind":"Field","name":{"kind":"Name","value":"demandOp"}},{"kind":"Field","name":{"kind":"Name","value":"demandP"}},{"kind":"Field","name":{"kind":"Name","value":"demandS"}},{"kind":"Field","name":{"kind":"Name","value":"fit"}},{"kind":"Field","name":{"kind":"Name","value":"fitPeak"}},{"kind":"Field","name":{"kind":"Name","value":"fitCritical"}},{"kind":"Field","name":{"kind":"Name","value":"fitVpp"}},{"kind":"Field","name":{"kind":"Name","value":"offPeak"}},{"kind":"Field","name":{"kind":"Name","value":"peak"}},{"kind":"Field","name":{"kind":"Name","value":"shoulder"}},{"kind":"Field","name":{"kind":"Name","value":"supplyCharge"}},{"kind":"Field","name":{"kind":"Name","value":"vppOrcharge"}},{"kind":"Field","name":{"kind":"Name","value":"dynamicRates"}},{"kind":"Field","name":{"kind":"Name","value":"priceUnits"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"vppDetails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"vpp"}},{"kind":"Field","name":{"kind":"Name","value":"vppConnected"}},{"kind":"Field","name":{"kind":"Name","value":"vppSignupBonus"}}]}},{"kind":"Field","name":{"kind":"Name","value":"solarDetails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hassolar"}},{"kind":"Field","name":{"kind":"Name","value":"solarcapacity"}},{"kind":"Field","name":{"kind":"Name","value":"invertercapacity"}}]}},{"kind":"Field","name":{"kind":"Name","value":"batteryDetails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"batterybrand"}},{"kind":"Field","name":{"kind":"Name","value":"snnumber"}},{"kind":"Field","name":{"kind":"Name","value":"batterycapacity"}},{"kind":"Field","name":{"kind":"Name","value":"exportlimit"}},{"kind":"Field","name":{"kind":"Name","value":"inverterCapacity"}}]}},{"kind":"Field","name":{"kind":"Name","value":"enrollmentDetails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"saletype"}},{"kind":"Field","name":{"kind":"Name","value":"connectiondate"}},{"kind":"Field","name":{"kind":"Name","value":"idtype"}},{"kind":"Field","name":{"kind":"Name","value":"idnumber"}},{"kind":"Field","name":{"kind":"Name","value":"idstate"}},{"kind":"Field","name":{"kind":"Name","value":"idcountry"}},{"kind":"Field","name":{"kind":"Name","value":"idexpiry"}},{"kind":"Field","name":{"kind":"Name","value":"concession"}},{"kind":"Field","name":{"kind":"Name","value":"lifesupport"}},{"kind":"Field","name":{"kind":"Name","value":"billingpreference"}},{"kind":"Field","name":{"kind":"Name","value":"licenseNumber"}},{"kind":"Field","name":{"kind":"Name","value":"licenseState"}},{"kind":"Field","name":{"kind":"Name","value":"licenseExpiry"}}]}},{"kind":"Field","name":{"kind":"Name","value":"debitDetails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"optIn"}},{"kind":"Field","name":{"kind":"Name","value":"accountType"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"bankName"}},{"kind":"Field","name":{"kind":"Name","value":"bankAddress"}},{"kind":"Field","name":{"kind":"Name","value":"bsb"}},{"kind":"Field","name":{"kind":"Name","value":"accountNumber"}},{"kind":"Field","name":{"kind":"Name","value":"paymentFrequency"}},{"kind":"Field","name":{"kind":"Name","value":"firstDebitDate"}}]}},{"kind":"Field","name":{"kind":"Name","value":"utilmateDetails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"utilmateConnected"}}]}},{"kind":"Field","name":{"kind":"Name","value":"previousBill"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"filename"}},{"kind":"Field","name":{"kind":"Name","value":"path"}}]}},{"kind":"Field","name":{"kind":"Name","value":"identityProof"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"filename"}},{"kind":"Field","name":{"kind":"Name","value":"path"}}]}},{"kind":"Field","name":{"kind":"Name","value":"licenseDocument"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"filename"}},{"kind":"Field","name":{"kind":"Name","value":"path"}}]}},{"kind":"Field","name":{"kind":"Name","value":"vppCertificateDetails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isAllRequiredFilled"}},{"kind":"Field","name":{"kind":"Name","value":"isVppCertificateEmailSent"}},{"kind":"Field","name":{"kind":"Name","value":"isVppCertificateEmailSentAt"}}]}}]}}]}}]} as unknown as DocumentNode<GetCustomerGeneralDetailsQuery, GetCustomerGeneralDetailsQueryVariables>;
export const GetCustomerSolarVppDetailsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCustomerSolarVppDetails"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"customer"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uid"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"vppDetails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"customerUid"}},{"kind":"Field","name":{"kind":"Name","value":"vpp"}},{"kind":"Field","name":{"kind":"Name","value":"vppConnected"}},{"kind":"Field","name":{"kind":"Name","value":"vppSignupBonus"}}]}},{"kind":"Field","name":{"kind":"Name","value":"solarDetails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"customerUid"}},{"kind":"Field","name":{"kind":"Name","value":"hassolar"}},{"kind":"Field","name":{"kind":"Name","value":"solarcapacity"}},{"kind":"Field","name":{"kind":"Name","value":"invertercapacity"}}]}},{"kind":"Field","name":{"kind":"Name","value":"batteryDetails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"customerUid"}},{"kind":"Field","name":{"kind":"Name","value":"batterybrand"}},{"kind":"Field","name":{"kind":"Name","value":"snnumber"}},{"kind":"Field","name":{"kind":"Name","value":"batterycapacity"}},{"kind":"Field","name":{"kind":"Name","value":"exportlimit"}},{"kind":"Field","name":{"kind":"Name","value":"inverterCapacity"}},{"kind":"Field","name":{"kind":"Name","value":"checkCode"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]}}]} as unknown as DocumentNode<GetCustomerSolarVppDetailsQuery, GetCustomerSolarVppDetailsQueryVariables>;
export const GetCustomerVppCertificateDetailsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCustomerVppCertificateDetails"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"customer"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uid"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"vppCertificateDetails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"certificateNo"}},{"kind":"Field","name":{"kind":"Name","value":"issueDate"}},{"kind":"Field","name":{"kind":"Name","value":"batteryManufacturer"}},{"kind":"Field","name":{"kind":"Name","value":"batteryModel"}},{"kind":"Field","name":{"kind":"Name","value":"batterySerialNumber"}},{"kind":"Field","name":{"kind":"Name","value":"batteryInstalledDate"}},{"kind":"Field","name":{"kind":"Name","value":"batteryUsableCapacity"}},{"kind":"Field","name":{"kind":"Name","value":"batteryPortConnected"}},{"kind":"Field","name":{"kind":"Name","value":"inverterManufacturer"}},{"kind":"Field","name":{"kind":"Name","value":"inverterModel"}},{"kind":"Field","name":{"kind":"Name","value":"inverterSnNumbers"}},{"kind":"Field","name":{"kind":"Name","value":"inverterCapacity"}},{"kind":"Field","name":{"kind":"Name","value":"isLifeSupportEquipment"}},{"kind":"Field","name":{"kind":"Name","value":"ifYesDetails"}},{"kind":"Field","name":{"kind":"Name","value":"internetConnectionType"}},{"kind":"Field","name":{"kind":"Name","value":"internetOtherText"}},{"kind":"Field","name":{"kind":"Name","value":"modemRouterLocation"}},{"kind":"Field","name":{"kind":"Name","value":"apiIntegration"}},{"kind":"Field","name":{"kind":"Name","value":"remoteChargesCommandTest"}},{"kind":"Field","name":{"kind":"Name","value":"remoteChargesCommandTestAt"}},{"kind":"Field","name":{"kind":"Name","value":"remoteDischargesCommandTest"}},{"kind":"Field","name":{"kind":"Name","value":"remoteDischargesCommandTestAt"}},{"kind":"Field","name":{"kind":"Name","value":"stateOfChangeMonitoring"}},{"kind":"Field","name":{"kind":"Name","value":"stateOfChangeMonitoringAt"}},{"kind":"Field","name":{"kind":"Name","value":"gridExportVerification"}},{"kind":"Field","name":{"kind":"Name","value":"gridExportVerificationAt"}},{"kind":"Field","name":{"kind":"Name","value":"gridImportVerification"}},{"kind":"Field","name":{"kind":"Name","value":"gridImportVerificationAt"}},{"kind":"Field","name":{"kind":"Name","value":"communicationFailSafeTest"}},{"kind":"Field","name":{"kind":"Name","value":"communicationFailSafeTestAt"}},{"kind":"Field","name":{"kind":"Name","value":"testResult"}},{"kind":"Field","name":{"kind":"Name","value":"additionalNotes"}},{"kind":"Field","name":{"kind":"Name","value":"isAllRequiredFilled"}},{"kind":"Field","name":{"kind":"Name","value":"isVppCertificateEmailSent"}},{"kind":"Field","name":{"kind":"Name","value":"isVppCertificateEmailSentAt"}}]}}]}}]}}]} as unknown as DocumentNode<GetCustomerVppCertificateDetailsQuery, GetCustomerVppCertificateDetailsQueryVariables>;
export const GetCustomerDebitDetailsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCustomerDebitDetails"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"customer"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uid"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"debitDetails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"customerUid"}},{"kind":"Field","name":{"kind":"Name","value":"accountType"}},{"kind":"Field","name":{"kind":"Name","value":"companyName"}},{"kind":"Field","name":{"kind":"Name","value":"abn"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"bankName"}},{"kind":"Field","name":{"kind":"Name","value":"bankAddress"}},{"kind":"Field","name":{"kind":"Name","value":"bsb"}},{"kind":"Field","name":{"kind":"Name","value":"accountNumber"}},{"kind":"Field","name":{"kind":"Name","value":"paymentFrequency"}},{"kind":"Field","name":{"kind":"Name","value":"firstDebitDate"}},{"kind":"Field","name":{"kind":"Name","value":"optIn"}}]}}]}}]}}]} as unknown as DocumentNode<GetCustomerDebitDetailsQuery, GetCustomerDebitDetailsQueryVariables>;
export const GetCustomerUtilmateDetailsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCustomerUtilmateDetails"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"customer"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uid"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"utilmateDetails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"customerUid"}},{"kind":"Field","name":{"kind":"Name","value":"siteIdentifier"}},{"kind":"Field","name":{"kind":"Name","value":"accountNumber"}},{"kind":"Field","name":{"kind":"Name","value":"utilmateConnected"}},{"kind":"Field","name":{"kind":"Name","value":"utilmateConnectedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"msatDetails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"customerUid"}},{"kind":"Field","name":{"kind":"Name","value":"msatConnected"}},{"kind":"Field","name":{"kind":"Name","value":"msatConnectedAt"}},{"kind":"Field","name":{"kind":"Name","value":"msatUpdatedAt"}}]}}]}}]}}]} as unknown as DocumentNode<GetCustomerUtilmateDetailsQuery, GetCustomerUtilmateDetailsQueryVariables>;
export const GetCustomerDocumentsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCustomerDocuments"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"customer"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uid"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"previousBill"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"customerUid"}},{"kind":"Field","name":{"kind":"Name","value":"filename"}},{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"size"}},{"kind":"Field","name":{"kind":"Name","value":"mimeType"}},{"kind":"Field","name":{"kind":"Name","value":"documentType"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"category"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"}},{"kind":"Field","name":{"kind":"Name","value":"createdByUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"identityProof"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"customerUid"}},{"kind":"Field","name":{"kind":"Name","value":"filename"}},{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"size"}},{"kind":"Field","name":{"kind":"Name","value":"mimeType"}},{"kind":"Field","name":{"kind":"Name","value":"documentType"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"category"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"}},{"kind":"Field","name":{"kind":"Name","value":"createdByUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"licenseDocument"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"customerUid"}},{"kind":"Field","name":{"kind":"Name","value":"filename"}},{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"size"}},{"kind":"Field","name":{"kind":"Name","value":"mimeType"}},{"kind":"Field","name":{"kind":"Name","value":"documentType"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"category"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"}},{"kind":"Field","name":{"kind":"Name","value":"createdByUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"documents"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"customerUid"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"filename"}},{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"size"}},{"kind":"Field","name":{"kind":"Name","value":"mimeType"}},{"kind":"Field","name":{"kind":"Name","value":"documentType"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"category"}}]}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"}},{"kind":"Field","name":{"kind":"Name","value":"createdByUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetCustomerDocumentsQuery, GetCustomerDocumentsQueryVariables>;
export const CheckAddressExistsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CheckAddressExists"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"address"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CustomerAddressInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"checkAddressExists"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"address"},"value":{"kind":"Variable","name":{"kind":"Name","value":"address"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"customerId"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"businessName"}},{"kind":"Field","name":{"kind":"Name","value":"abn"}}]}}]}}]} as unknown as DocumentNode<CheckAddressExistsQuery, CheckAddressExistsQueryVariables>;
export const CheckNmiExistsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CheckNmiExists"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"nmi"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"checkNmiExists"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"nmi"},"value":{"kind":"Variable","name":{"kind":"Name","value":"nmi"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"customerId"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"businessName"}},{"kind":"Field","name":{"kind":"Name","value":"abn"}}]}}]}}]} as unknown as DocumentNode<CheckNmiExistsQuery, CheckNmiExistsQueryVariables>;
export const ValidateCustomerAccessCodeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ValidateCustomerAccessCode"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"customerId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"code"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"validateCustomerAccessCode"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"customerId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"customerId"}}},{"kind":"Argument","name":{"kind":"Name","value":"code"},"value":{"kind":"Variable","name":{"kind":"Name","value":"code"}}}]}]}}]} as unknown as DocumentNode<ValidateCustomerAccessCodeQuery, ValidateCustomerAccessCodeQueryVariables>;
export const GetCustomerByCustomerIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCustomerByCustomerId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"customerId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"customerByCustomerId"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"customerId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"customerId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"customerId"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"businessName"}},{"kind":"Field","name":{"kind":"Name","value":"abn"}},{"kind":"Field","name":{"kind":"Name","value":"showAsBusinessName"}},{"kind":"Field","name":{"kind":"Name","value":"showName"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"dob"}},{"kind":"Field","name":{"kind":"Name","value":"propertyType"}},{"kind":"Field","name":{"kind":"Name","value":"tariffCode"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"discount"}},{"kind":"Field","name":{"kind":"Name","value":"signDate"}},{"kind":"Field","name":{"kind":"Name","value":"emailSent"}},{"kind":"Field","name":{"kind":"Name","value":"offerEmailSentAt"}},{"kind":"Field","name":{"kind":"Name","value":"utilmateStatus"}},{"kind":"Field","name":{"kind":"Name","value":"viewCode"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"phoneVerifiedAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"address"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"customerUid"}},{"kind":"Field","name":{"kind":"Name","value":"unitNumber"}},{"kind":"Field","name":{"kind":"Name","value":"streetNumber"}},{"kind":"Field","name":{"kind":"Name","value":"streetName"}},{"kind":"Field","name":{"kind":"Name","value":"streetType"}},{"kind":"Field","name":{"kind":"Name","value":"suburb"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"postcode"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"nmi"}},{"kind":"Field","name":{"kind":"Name","value":"fullAddress"}}]}},{"kind":"Field","name":{"kind":"Name","value":"msatDetails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"customerUid"}},{"kind":"Field","name":{"kind":"Name","value":"msatConnected"}},{"kind":"Field","name":{"kind":"Name","value":"msatConnectedAt"}},{"kind":"Field","name":{"kind":"Name","value":"msatUpdatedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"vppDetails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"customerUid"}},{"kind":"Field","name":{"kind":"Name","value":"vpp"}},{"kind":"Field","name":{"kind":"Name","value":"vppConnected"}},{"kind":"Field","name":{"kind":"Name","value":"vppSignupBonus"}}]}},{"kind":"Field","name":{"kind":"Name","value":"solarDetails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"customerUid"}},{"kind":"Field","name":{"kind":"Name","value":"hassolar"}},{"kind":"Field","name":{"kind":"Name","value":"solarcapacity"}},{"kind":"Field","name":{"kind":"Name","value":"invertercapacity"}}]}},{"kind":"Field","name":{"kind":"Name","value":"batteryDetails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"customerUid"}},{"kind":"Field","name":{"kind":"Name","value":"batterybrand"}},{"kind":"Field","name":{"kind":"Name","value":"snnumber"}},{"kind":"Field","name":{"kind":"Name","value":"batterycapacity"}},{"kind":"Field","name":{"kind":"Name","value":"exportlimit"}},{"kind":"Field","name":{"kind":"Name","value":"inverterCapacity"}},{"kind":"Field","name":{"kind":"Name","value":"checkCode"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"debitDetails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"customerUid"}},{"kind":"Field","name":{"kind":"Name","value":"accountType"}},{"kind":"Field","name":{"kind":"Name","value":"companyName"}},{"kind":"Field","name":{"kind":"Name","value":"abn"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"bankName"}},{"kind":"Field","name":{"kind":"Name","value":"bankAddress"}},{"kind":"Field","name":{"kind":"Name","value":"bsb"}},{"kind":"Field","name":{"kind":"Name","value":"accountNumber"}},{"kind":"Field","name":{"kind":"Name","value":"paymentFrequency"}},{"kind":"Field","name":{"kind":"Name","value":"firstDebitDate"}},{"kind":"Field","name":{"kind":"Name","value":"optIn"}}]}},{"kind":"Field","name":{"kind":"Name","value":"rateVersion"}},{"kind":"Field","name":{"kind":"Name","value":"offerVersion"}},{"kind":"Field","name":{"kind":"Name","value":"ratePlan"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"codes"}},{"kind":"Field","name":{"kind":"Name","value":"planId"}},{"kind":"Field","name":{"kind":"Name","value":"dnsp"}},{"kind":"Field","name":{"kind":"Name","value":"tariff"}},{"kind":"Field","name":{"kind":"Name","value":"vpp"}},{"kind":"Field","name":{"kind":"Name","value":"offers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"offerName"}},{"kind":"Field","name":{"kind":"Name","value":"anytime"}},{"kind":"Field","name":{"kind":"Name","value":"cl1Supply"}},{"kind":"Field","name":{"kind":"Name","value":"cl1Usage"}},{"kind":"Field","name":{"kind":"Name","value":"cl2Supply"}},{"kind":"Field","name":{"kind":"Name","value":"cl2Usage"}},{"kind":"Field","name":{"kind":"Name","value":"demand"}},{"kind":"Field","name":{"kind":"Name","value":"demandOp"}},{"kind":"Field","name":{"kind":"Name","value":"demandP"}},{"kind":"Field","name":{"kind":"Name","value":"demandS"}},{"kind":"Field","name":{"kind":"Name","value":"fit"}},{"kind":"Field","name":{"kind":"Name","value":"fitPeak"}},{"kind":"Field","name":{"kind":"Name","value":"fitCritical"}},{"kind":"Field","name":{"kind":"Name","value":"fitVpp"}},{"kind":"Field","name":{"kind":"Name","value":"offPeak"}},{"kind":"Field","name":{"kind":"Name","value":"peak"}},{"kind":"Field","name":{"kind":"Name","value":"shoulder"}},{"kind":"Field","name":{"kind":"Name","value":"supplyCharge"}},{"kind":"Field","name":{"kind":"Name","value":"vppOrcharge"}},{"kind":"Field","name":{"kind":"Name","value":"dynamicRates"}},{"kind":"Field","name":{"kind":"Name","value":"priceUnits"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"enrollmentDetails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"customerUid"}},{"kind":"Field","name":{"kind":"Name","value":"saletype"}},{"kind":"Field","name":{"kind":"Name","value":"connectiondate"}},{"kind":"Field","name":{"kind":"Name","value":"idtype"}},{"kind":"Field","name":{"kind":"Name","value":"idnumber"}},{"kind":"Field","name":{"kind":"Name","value":"idstate"}},{"kind":"Field","name":{"kind":"Name","value":"idcountry"}},{"kind":"Field","name":{"kind":"Name","value":"idexpiry"}},{"kind":"Field","name":{"kind":"Name","value":"concession"}},{"kind":"Field","name":{"kind":"Name","value":"lifesupport"}},{"kind":"Field","name":{"kind":"Name","value":"billingpreference"}}]}},{"kind":"Field","name":{"kind":"Name","value":"documents"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"customerUid"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"filename"}},{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"size"}},{"kind":"Field","name":{"kind":"Name","value":"mimeType"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"}},{"kind":"Field","name":{"kind":"Name","value":"createdByUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetCustomerByCustomerIdQuery, GetCustomerByCustomerIdQueryVariables>;
export const GetDocumentTypesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetDocumentTypes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"documentTypes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}}]}}]}}]} as unknown as DocumentNode<GetDocumentTypesQuery, GetDocumentTypesQueryVariables>;
export const GetRiskStatusesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetRiskStatuses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"riskStatuses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"scoreMin"}},{"kind":"Field","name":{"kind":"Name","value":"scoreMax"}},{"kind":"Field","name":{"kind":"Name","value":"manualOffer"}},{"kind":"Field","name":{"kind":"Name","value":"sortOrder"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}}]}}]}}]} as unknown as DocumentNode<GetRiskStatusesQuery, GetRiskStatusesQueryVariables>;
export const SearchCustomersBasicDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SearchCustomersBasic"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"searchName"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"customersCursor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"searchName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchName"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"customerId"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"address"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fullAddress"}}]}}]}}]}}]}}]} as unknown as DocumentNode<SearchCustomersBasicQuery, SearchCustomersBasicQueryVariables>;
export const GetCustomerBillingInfoDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCustomerBillingInfo"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"customer"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uid"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"customerId"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"creditScore"}},{"kind":"Field","name":{"kind":"Name","value":"riskStatus"}},{"kind":"Field","name":{"kind":"Name","value":"address"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fullAddress"}}]}},{"kind":"Field","name":{"kind":"Name","value":"enrollmentDetails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"billingpreference"}}]}},{"kind":"Field","name":{"kind":"Name","value":"debitDetails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"optIn"}}]}},{"kind":"Field","name":{"kind":"Name","value":"utilmateDetails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountNumber"}},{"kind":"Field","name":{"kind":"Name","value":"siteIdentifier"}}]}}]}}]}}]} as unknown as DocumentNode<GetCustomerBillingInfoQuery, GetCustomerBillingInfoQueryVariables>;
export const GetCustomerDashboardDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCustomerDashboard"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"customerDashboard"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"utilmateStatusSummary"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"customers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"customerId"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"utilmateStatus"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"signedStatusSummary"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"customers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"customerId"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"vppPendingSummary"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"customers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"customerId"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"vppConnected"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetCustomerDashboardQuery, GetCustomerDashboardQueryVariables>;
export const GetAllEmailLogsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAllEmailLogs"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"search"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"status"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"emailType"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"allEmailLogs"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"search"},"value":{"kind":"Variable","name":{"kind":"Name","value":"search"}}},{"kind":"Argument","name":{"kind":"Name","value":"status"},"value":{"kind":"Variable","name":{"kind":"Name","value":"status"}}},{"kind":"Argument","name":{"kind":"Name","value":"emailType"},"value":{"kind":"Variable","name":{"kind":"Name","value":"emailType"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"meta"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalRecords"}},{"kind":"Field","name":{"kind":"Name","value":"currentPage"}},{"kind":"Field","name":{"kind":"Name","value":"totalPages"}},{"kind":"Field","name":{"kind":"Name","value":"recordsPerPage"}}]}},{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"customerUid"}},{"kind":"Field","name":{"kind":"Name","value":"customerId"}},{"kind":"Field","name":{"kind":"Name","value":"emailTo"}},{"kind":"Field","name":{"kind":"Name","value":"emailType"}},{"kind":"Field","name":{"kind":"Name","value":"subject"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"errorMessage"}},{"kind":"Field","name":{"kind":"Name","value":"sentAt"}},{"kind":"Field","name":{"kind":"Name","value":"verifiedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"}},{"kind":"Field","name":{"kind":"Name","value":"tenant"}},{"kind":"Field","name":{"kind":"Name","value":"verificationCode"}}]}}]}}]}}]} as unknown as DocumentNode<GetAllEmailLogsQuery, GetAllEmailLogsQueryVariables>;
export const GetCustomerEmailLogsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCustomerEmailLogs"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"customerUid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"customerEmailLogs"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"customerUid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"customerUid"}}},{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"meta"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalRecords"}},{"kind":"Field","name":{"kind":"Name","value":"currentPage"}},{"kind":"Field","name":{"kind":"Name","value":"totalPages"}},{"kind":"Field","name":{"kind":"Name","value":"recordsPerPage"}}]}},{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"customerUid"}},{"kind":"Field","name":{"kind":"Name","value":"customerId"}},{"kind":"Field","name":{"kind":"Name","value":"emailTo"}},{"kind":"Field","name":{"kind":"Name","value":"emailType"}},{"kind":"Field","name":{"kind":"Name","value":"subject"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"errorMessage"}},{"kind":"Field","name":{"kind":"Name","value":"sentAt"}},{"kind":"Field","name":{"kind":"Name","value":"verifiedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"}},{"kind":"Field","name":{"kind":"Name","value":"tenant"}},{"kind":"Field","name":{"kind":"Name","value":"verificationCode"}}]}}]}}]}}]} as unknown as DocumentNode<GetCustomerEmailLogsQuery, GetCustomerEmailLogsQueryVariables>;
export const GetAllEmailSettingsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAllEmailSettings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"emailSettings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"eventType"}},{"kind":"Field","name":{"kind":"Name","value":"templateUid"}},{"kind":"Field","name":{"kind":"Name","value":"template"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}}]}}]}}]} as unknown as DocumentNode<GetAllEmailSettingsQuery, GetAllEmailSettingsQueryVariables>;
export const UpdateEmailSettingDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateEmailSetting"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"eventType"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"templateUid"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateEmailSetting"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"eventType"},"value":{"kind":"Variable","name":{"kind":"Name","value":"eventType"}}},{"kind":"Argument","name":{"kind":"Name","value":"templateUid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"templateUid"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"eventType"}},{"kind":"Field","name":{"kind":"Name","value":"templateUid"}},{"kind":"Field","name":{"kind":"Name","value":"template"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}}]}}]}}]} as unknown as DocumentNode<UpdateEmailSettingMutation, UpdateEmailSettingMutationVariables>;
export const GetEmailTemplatesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetEmailTemplates"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"status"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"entityType"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"emailTemplates"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"status"},"value":{"kind":"Variable","name":{"kind":"Name","value":"status"}}},{"kind":"Argument","name":{"kind":"Name","value":"entityType"},"value":{"kind":"Variable","name":{"kind":"Name","value":"entityType"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"subject"}},{"kind":"Field","name":{"kind":"Name","value":"entityType"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"meta"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalRecords"}},{"kind":"Field","name":{"kind":"Name","value":"currentPage"}},{"kind":"Field","name":{"kind":"Name","value":"totalPages"}},{"kind":"Field","name":{"kind":"Name","value":"recordsPerPage"}}]}}]}}]}}]} as unknown as DocumentNode<GetEmailTemplatesQuery, GetEmailTemplatesQueryVariables>;
export const GetEmailTemplateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetEmailTemplate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"emailTemplate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uid"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"entityType"}},{"kind":"Field","name":{"kind":"Name","value":"subject"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<GetEmailTemplateQuery, GetEmailTemplateQueryVariables>;
export const PreviewSystemTemplateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PreviewSystemTemplate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"eventType"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"previewSystemTemplate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"eventType"},"value":{"kind":"Variable","name":{"kind":"Name","value":"eventType"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"subject"}},{"kind":"Field","name":{"kind":"Name","value":"body"}}]}}]}}]} as unknown as DocumentNode<PreviewSystemTemplateQuery, PreviewSystemTemplateQueryVariables>;
export const GetMenusDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMenus"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"menus"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"parentUid"}}]}},{"kind":"Field","name":{"kind":"Name","value":"meta"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalRecords"}}]}}]}}]}}]} as unknown as DocumentNode<GetMenusQuery, GetMenusQueryVariables>;
export const GetFeaturesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetFeatures"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"menuUid"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"features"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"menuUid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"menuUid"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"menuUid"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}}]}}]}}]} as unknown as DocumentNode<GetFeaturesQuery, GetFeaturesQueryVariables>;
export const GetCustomerNotesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCustomerNotes"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"customerUid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"customerNotes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"customerUid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"customerUid"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"customerUid"}},{"kind":"Field","name":{"kind":"Name","value":"userUid"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"followUp"}},{"kind":"Field","name":{"kind":"Name","value":"assignedTo"}},{"kind":"Field","name":{"kind":"Name","value":"assignedToUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"noteTypeDetails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"color"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdByName"}}]}}]}}]} as unknown as DocumentNode<GetCustomerNotesQuery, GetCustomerNotesQueryVariables>;
export const GetNoteTypesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetNoteTypes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"noteTypes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"}}]}}]}}]} as unknown as DocumentNode<GetNoteTypesQuery, GetNoteTypesQueryVariables>;
export const GetNotificationEntitiesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetNotificationEntities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notificationEntities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"tenant"}},{"kind":"Field","name":{"kind":"Name","value":"fromEmail"}},{"kind":"Field","name":{"kind":"Name","value":"bccEmail"}},{"kind":"Field","name":{"kind":"Name","value":"preference"}},{"kind":"Field","name":{"kind":"Name","value":"entityType"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"userUids"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<GetNotificationEntitiesQuery, GetNotificationEntitiesQueryVariables>;
export const GetNotificationEntityDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetNotificationEntity"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notificationEntity"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uid"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"tenant"}},{"kind":"Field","name":{"kind":"Name","value":"fromEmail"}},{"kind":"Field","name":{"kind":"Name","value":"bccEmail"}},{"kind":"Field","name":{"kind":"Name","value":"preference"}},{"kind":"Field","name":{"kind":"Name","value":"entityType"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"userUids"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<GetNotificationEntityQuery, GetNotificationEntityQueryVariables>;
export const GetPdfTermsListDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPdfTermsList"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pdfTermsList"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"rateType"}},{"kind":"Field","name":{"kind":"Name","value":"rateUids"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"meta"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalRecords"}},{"kind":"Field","name":{"kind":"Name","value":"currentPage"}},{"kind":"Field","name":{"kind":"Name","value":"totalPages"}},{"kind":"Field","name":{"kind":"Name","value":"recordsPerPage"}}]}}]}}]}}]} as unknown as DocumentNode<GetPdfTermsListQuery, GetPdfTermsListQueryVariables>;
export const GetPdfTermDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPdfTerm"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pdfTerm"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uid"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"rateType"}},{"kind":"Field","name":{"kind":"Name","value":"rateUids"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<GetPdfTermQuery, GetPdfTermQueryVariables>;
export const GetRolePermissionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetRolePermissions"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"roleUid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"rolePermissions"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"roleUid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"roleUid"}}},{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"roleUid"}},{"kind":"Field","name":{"kind":"Name","value":"menuUid"}},{"kind":"Field","name":{"kind":"Name","value":"canView"}},{"kind":"Field","name":{"kind":"Name","value":"canCreate"}},{"kind":"Field","name":{"kind":"Name","value":"canEdit"}},{"kind":"Field","name":{"kind":"Name","value":"canDelete"}}]}}]}}]}}]} as unknown as DocumentNode<GetRolePermissionsQuery, GetRolePermissionsQueryVariables>;
export const GetRoleFeaturePermissionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetRoleFeaturePermissions"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"roleUid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"roleFeaturePermissions"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"roleUid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"roleUid"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"roleUid"}},{"kind":"Field","name":{"kind":"Name","value":"featureUid"}},{"kind":"Field","name":{"kind":"Name","value":"isEnabled"}}]}}]}}]} as unknown as DocumentNode<GetRoleFeaturePermissionsQuery, GetRoleFeaturePermissionsQueryVariables>;
export const RatePlansDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"RatePlans"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"search"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"state"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"dnsp"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"type"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ratePlans"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"search"},"value":{"kind":"Variable","name":{"kind":"Name","value":"search"}}},{"kind":"Argument","name":{"kind":"Name","value":"state"},"value":{"kind":"Variable","name":{"kind":"Name","value":"state"}}},{"kind":"Argument","name":{"kind":"Name","value":"dnsp"},"value":{"kind":"Variable","name":{"kind":"Name","value":"dnsp"}}},{"kind":"Argument","name":{"kind":"Name","value":"type"},"value":{"kind":"Variable","name":{"kind":"Name","value":"type"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"tenant"}},{"kind":"Field","name":{"kind":"Name","value":"codes"}},{"kind":"Field","name":{"kind":"Name","value":"planId"}},{"kind":"Field","name":{"kind":"Name","value":"dnsp"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"tariff"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"vpp"}},{"kind":"Field","name":{"kind":"Name","value":"discountApplies"}},{"kind":"Field","name":{"kind":"Name","value":"discountPercentage"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"}},{"kind":"Field","name":{"kind":"Name","value":"updatedBy"}},{"kind":"Field","name":{"kind":"Name","value":"deletedBy"}},{"kind":"Field","name":{"kind":"Name","value":"offers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"ratePlanUid"}},{"kind":"Field","name":{"kind":"Name","value":"tenant"}},{"kind":"Field","name":{"kind":"Name","value":"offerName"}},{"kind":"Field","name":{"kind":"Name","value":"anytime"}},{"kind":"Field","name":{"kind":"Name","value":"cl1Supply"}},{"kind":"Field","name":{"kind":"Name","value":"cl1Usage"}},{"kind":"Field","name":{"kind":"Name","value":"cl2Supply"}},{"kind":"Field","name":{"kind":"Name","value":"cl2Usage"}},{"kind":"Field","name":{"kind":"Name","value":"demand"}},{"kind":"Field","name":{"kind":"Name","value":"demandOp"}},{"kind":"Field","name":{"kind":"Name","value":"demandP"}},{"kind":"Field","name":{"kind":"Name","value":"demandS"}},{"kind":"Field","name":{"kind":"Name","value":"fit"}},{"kind":"Field","name":{"kind":"Name","value":"fitPeak"}},{"kind":"Field","name":{"kind":"Name","value":"fitCritical"}},{"kind":"Field","name":{"kind":"Name","value":"fitVpp"}},{"kind":"Field","name":{"kind":"Name","value":"offPeak"}},{"kind":"Field","name":{"kind":"Name","value":"peak"}},{"kind":"Field","name":{"kind":"Name","value":"shoulder"}},{"kind":"Field","name":{"kind":"Name","value":"supplyCharge"}},{"kind":"Field","name":{"kind":"Name","value":"vppOrcharge"}},{"kind":"Field","name":{"kind":"Name","value":"dynamicRates"}},{"kind":"Field","name":{"kind":"Name","value":"priceUnits"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"}},{"kind":"Field","name":{"kind":"Name","value":"updatedBy"}},{"kind":"Field","name":{"kind":"Name","value":"deletedBy"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"meta"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalRecords"}},{"kind":"Field","name":{"kind":"Name","value":"currentPage"}},{"kind":"Field","name":{"kind":"Name","value":"totalPages"}},{"kind":"Field","name":{"kind":"Name","value":"recordsPerPage"}}]}}]}}]}}]} as unknown as DocumentNode<RatePlansQuery, RatePlansQueryVariables>;
export const RatesHistoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"RatesHistory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"ratePlanUid"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"auditAction"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ratesHistory"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"ratePlanUid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ratePlanUid"}}},{"kind":"Argument","name":{"kind":"Name","value":"auditAction"},"value":{"kind":"Variable","name":{"kind":"Name","value":"auditAction"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"version"}},{"kind":"Field","name":{"kind":"Name","value":"ratePlanUid"}},{"kind":"Field","name":{"kind":"Name","value":"auditAction"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"}},{"kind":"Field","name":{"kind":"Name","value":"createdByName"}},{"kind":"Field","name":{"kind":"Name","value":"activeVersion"}},{"kind":"Field","name":{"kind":"Name","value":"newRecord"}}]}},{"kind":"Field","name":{"kind":"Name","value":"meta"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalRecords"}},{"kind":"Field","name":{"kind":"Name","value":"currentPage"}},{"kind":"Field","name":{"kind":"Name","value":"totalPages"}},{"kind":"Field","name":{"kind":"Name","value":"recordsPerPage"}}]}}]}}]}}]} as unknown as DocumentNode<RatesHistoryQuery, RatesHistoryQueryVariables>;
export const HistoryDetailsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"HistoryDetails"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ratesHistoryRecord"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uid"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"newRecord"}},{"kind":"Field","name":{"kind":"Name","value":"oldRecord"}}]}}]}}]} as unknown as DocumentNode<HistoryDetailsQuery, HistoryDetailsQueryVariables>;
export const GlobalActiveRatesHistoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GlobalActiveRatesHistory"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"globalActiveRatesHistory"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"version"}},{"kind":"Field","name":{"kind":"Name","value":"newRecord"}},{"kind":"Field","name":{"kind":"Name","value":"activeVersion"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdByName"}}]}}]}}]} as unknown as DocumentNode<GlobalActiveRatesHistoryQuery, GlobalActiveRatesHistoryQueryVariables>;
export const HasRatesChangesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"HasRatesChanges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasRatesChanges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasChanges"}},{"kind":"Field","name":{"kind":"Name","value":"changedRatePlanUids"}},{"kind":"Field","name":{"kind":"Name","value":"changes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"newRecord"}},{"kind":"Field","name":{"kind":"Name","value":"oldRecord"}}]}}]}}]}}]} as unknown as DocumentNode<HasRatesChangesQuery, HasRatesChangesQueryVariables>;
export const RatesHistoryByVersionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"RatesHistoryByVersion"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"version"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ratesHistoryByVersion"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"version"},"value":{"kind":"Variable","name":{"kind":"Name","value":"version"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"version"}},{"kind":"Field","name":{"kind":"Name","value":"newRecord"}},{"kind":"Field","name":{"kind":"Name","value":"activeVersion"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]} as unknown as DocumentNode<RatesHistoryByVersionQuery, RatesHistoryByVersionQueryVariables>;
export const MeasurementUnitsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MeasurementUnits"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"measurementUnits"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<MeasurementUnitsQuery, MeasurementUnitsQueryVariables>;
export const GetRolesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetRoles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"roles"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"IntValue","value":"1"}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"100"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]}}]} as unknown as DocumentNode<GetRolesQuery, GetRolesQueryVariables>;
export const GetUserPermissionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUserPermissions"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userUid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userPermissions"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userUid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userUid"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userUid"}},{"kind":"Field","name":{"kind":"Name","value":"menuUid"}},{"kind":"Field","name":{"kind":"Name","value":"canView"}},{"kind":"Field","name":{"kind":"Name","value":"canCreate"}},{"kind":"Field","name":{"kind":"Name","value":"canEdit"}},{"kind":"Field","name":{"kind":"Name","value":"canDelete"}}]}}]}}]} as unknown as DocumentNode<GetUserPermissionsQuery, GetUserPermissionsQueryVariables>;
export const GetUserFeaturePermissionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUserFeaturePermissions"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userUid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userFeaturePermissions"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userUid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userUid"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userUid"}},{"kind":"Field","name":{"kind":"Name","value":"featureUid"}},{"kind":"Field","name":{"kind":"Name","value":"isEnabled"}}]}}]}}]} as unknown as DocumentNode<GetUserFeaturePermissionsQuery, GetUserFeaturePermissionsQueryVariables>;
export const GetUsersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUsers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"status"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"search"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"roleUid"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"users"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"status"},"value":{"kind":"Variable","name":{"kind":"Name","value":"status"}}},{"kind":"Argument","name":{"kind":"Name","value":"search"},"value":{"kind":"Variable","name":{"kind":"Name","value":"search"}}},{"kind":"Argument","name":{"kind":"Name","value":"roleUid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"roleUid"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"meta"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalRecords"}},{"kind":"Field","name":{"kind":"Name","value":"currentPage"}},{"kind":"Field","name":{"kind":"Name","value":"totalPages"}},{"kind":"Field","name":{"kind":"Name","value":"recordsPerPage"}}]}},{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"password"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"tenant"}},{"kind":"Field","name":{"kind":"Name","value":"roleUid"}},{"kind":"Field","name":{"kind":"Name","value":"roleName"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]}}]} as unknown as DocumentNode<GetUsersQuery, GetUsersQueryVariables>;
export const GetUserByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUserById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uid"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"tenant"}},{"kind":"Field","name":{"kind":"Name","value":"roleUid"}},{"kind":"Field","name":{"kind":"Name","value":"roleName"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]} as unknown as DocumentNode<GetUserByIdQuery, GetUserByIdQueryVariables>;