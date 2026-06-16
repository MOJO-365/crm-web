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

export type Announcement = {
  __typename?: 'Announcement';
  createdAt: Scalars['Date']['output'];
  createdBy?: Maybe<Scalars['String']['output']>;
  deletedBy?: Maybe<Scalars['String']['output']>;
  fileName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  isActive: Scalars['Boolean']['output'];
  isDeleted: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  tenant?: Maybe<Scalars['String']['output']>;
  uid: Scalars['String']['output'];
  updatedAt: Scalars['Date']['output'];
  updatedBy?: Maybe<Scalars['String']['output']>;
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

export type BatteryMake = {
  __typename?: 'BatteryMake';
  actualModelRows?: Maybe<Scalars['Int']['output']>;
  avgCapacity?: Maybe<Scalars['Float']['output']>;
  batteryCapacityKwh?: Maybe<Scalars['Float']['output']>;
  batteryProdWarranty?: Maybe<Scalars['String']['output']>;
  batteryUsableCapacity?: Maybe<Scalars['Float']['output']>;
  bess2EligibleModels?: Maybe<Scalars['Int']['output']>;
  cecStatus?: Maybe<Scalars['Int']['output']>;
  cegCapacity?: Maybe<Scalars['Float']['output']>;
  cegExpiryDate?: Maybe<Scalars['Date']['output']>;
  countCheck?: Maybe<Scalars['Int']['output']>;
  createdAt: Scalars['Date']['output'];
  datasheetName?: Maybe<Scalars['String']['output']>;
  datasheetPath?: Maybe<Scalars['String']['output']>;
  datasheetUrl?: Maybe<Scalars['String']['output']>;
  declaredModelCount?: Maybe<Scalars['Int']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  isActive: Scalars['Boolean']['output'];
  make: Scalars['String']['output'];
  maxBackupLoad?: Maybe<Scalars['Float']['output']>;
  maxCapacity?: Maybe<Scalars['Float']['output']>;
  minCapacity?: Maybe<Scalars['Float']['output']>;
  modelsWithVppPrograms?: Maybe<Scalars['Int']['output']>;
  pdrsStatus?: Maybe<Scalars['Int']['output']>;
  productStatus?: Maybe<Scalars['Int']['output']>;
  shortName?: Maybe<Scalars['String']['output']>;
  tenant: Scalars['String']['output'];
  totalVppListings?: Maybe<Scalars['Int']['output']>;
  uid: Scalars['String']['output'];
  updatedAt: Scalars['Date']['output'];
  vpp1EligibleModels?: Maybe<Scalars['Int']['output']>;
};

export type BatteryModel = {
  __typename?: 'BatteryModel';
  bess2Eligible?: Maybe<Scalars['Int']['output']>;
  capacity?: Maybe<Scalars['Float']['output']>;
  createdAt: Scalars['Date']['output'];
  id: Scalars['ID']['output'];
  isActive: Scalars['Boolean']['output'];
  makeUid: Scalars['String']['output'];
  model: Scalars['String']['output'];
  tenant: Scalars['String']['output'];
  uid: Scalars['String']['output'];
  updatedAt: Scalars['Date']['output'];
  vpp1Eligible?: Maybe<Scalars['Int']['output']>;
  vppProgram?: Maybe<Scalars['String']['output']>;
};

export type Bonus = {
  __typename?: 'Bonus';
  amount: Scalars['Float']['output'];
  contractTerm?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['Date']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  exitFee?: Maybe<Scalars['Float']['output']>;
  isActive: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  tenant: Scalars['String']['output'];
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['Date']['output']>;
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

export type CreateBatteryMakeInput = {
  actualModelRows?: InputMaybe<Scalars['Int']['input']>;
  batteryCapacityKwh?: InputMaybe<Scalars['Float']['input']>;
  batteryProdWarranty?: InputMaybe<Scalars['String']['input']>;
  batteryUsableCapacity?: InputMaybe<Scalars['Float']['input']>;
  cecStatus?: InputMaybe<Scalars['Int']['input']>;
  cegCapacity?: InputMaybe<Scalars['Float']['input']>;
  cegExpiryDate?: InputMaybe<Scalars['Date']['input']>;
  datasheetName?: InputMaybe<Scalars['String']['input']>;
  datasheetPath?: InputMaybe<Scalars['String']['input']>;
  declaredModelCount?: InputMaybe<Scalars['Int']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  make: Scalars['String']['input'];
  maxBackupLoad?: InputMaybe<Scalars['Float']['input']>;
  maxCapacity?: InputMaybe<Scalars['Float']['input']>;
  minCapacity?: InputMaybe<Scalars['Float']['input']>;
  pdrsStatus?: InputMaybe<Scalars['Int']['input']>;
  productStatus?: InputMaybe<Scalars['Int']['input']>;
  shortName?: InputMaybe<Scalars['String']['input']>;
};

export type CreateBatteryModelInput = {
  bess2Eligible?: InputMaybe<Scalars['Int']['input']>;
  capacity?: InputMaybe<Scalars['Float']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  makeUid: Scalars['String']['input'];
  model: Scalars['String']['input'];
  vpp1Eligible?: InputMaybe<Scalars['Int']['input']>;
  vppProgram?: InputMaybe<Scalars['String']['input']>;
};

export type CreateBonusInput = {
  amount: Scalars['Float']['input'];
  contractTerm?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  exitFee?: InputMaybe<Scalars['Float']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  name: Scalars['String']['input'];
};

export type CreateCustomerInput = {
  abn?: InputMaybe<Scalars['String']['input']>;
  address?: InputMaybe<CustomerAddressInput>;
  assignedToUid?: InputMaybe<Scalars['String']['input']>;
  batteryDetails?: InputMaybe<CustomerBatterySystemInput>;
  branchTenant?: InputMaybe<Scalars['String']['input']>;
  businessName?: InputMaybe<Scalars['String']['input']>;
  checkCreditScore?: InputMaybe<Scalars['Int']['input']>;
  consentSignatureBase64?: InputMaybe<Scalars['String']['input']>;
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
  isEnrollmentFinished?: InputMaybe<Scalars['Int']['input']>;
  isWithoutSignature?: InputMaybe<Scalars['Boolean']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  leadUid?: InputMaybe<Scalars['String']['input']>;
  legalName?: InputMaybe<Scalars['String']['input']>;
  licenseDocument?: InputMaybe<Scalars['String']['input']>;
  medicareCardType?: InputMaybe<Scalars['String']['input']>;
  medicareIrn?: InputMaybe<Scalars['String']['input']>;
  msatDetails?: InputMaybe<CustomerMsatInput>;
  number?: InputMaybe<Scalars['String']['input']>;
  pdfAudit?: InputMaybe<Scalars['String']['input']>;
  pdrsEmailSent?: InputMaybe<Scalars['Int']['input']>;
  pdrsEmailSentAt?: InputMaybe<Scalars['Date']['input']>;
  phoneVerifiedAt?: InputMaybe<Scalars['Date']['input']>;
  planUid?: InputMaybe<Scalars['String']['input']>;
  portalName?: InputMaybe<Scalars['String']['input']>;
  previousBill?: InputMaybe<Scalars['String']['input']>;
  previousCustomerUid?: InputMaybe<Scalars['String']['input']>;
  propertyType?: InputMaybe<Scalars['Int']['input']>;
  ratePlanUid?: InputMaybe<Scalars['String']['input']>;
  rateVersion?: InputMaybe<Scalars['String']['input']>;
  referralName?: InputMaybe<Scalars['String']['input']>;
  relationshipStatus?: InputMaybe<Scalars['Int']['input']>;
  riskStatus?: InputMaybe<Scalars['String']['input']>;
  selectedBonuses?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  showAsBusinessName?: InputMaybe<Scalars['Boolean']['input']>;
  showName?: InputMaybe<Scalars['Boolean']['input']>;
  signDate?: InputMaybe<Scalars['Date']['input']>;
  signatureBase64?: InputMaybe<Scalars['String']['input']>;
  signedPdfPath?: InputMaybe<Scalars['String']['input']>;
  solarDetails?: InputMaybe<CustomerSolarSystemInput>;
  source?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['Int']['input']>;
  tariffCode?: InputMaybe<Scalars['String']['input']>;
  tenant?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  utilmateDetails?: InputMaybe<CustomerUtilmateInput>;
  utilmateStatus?: InputMaybe<Scalars['Int']['input']>;
  utilmateUploadedManually?: InputMaybe<Scalars['Int']['input']>;
  vppCertificateDetails?: InputMaybe<CustomerVppCertificateDetailsInput>;
  vppDetails?: InputMaybe<CustomerVppInput>;
};

export type CreateEmailTemplateInput = {
  announcementUid?: InputMaybe<Scalars['String']['input']>;
  body?: InputMaybe<Scalars['String']['input']>;
  entityType?: InputMaybe<Scalars['Int']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  name: Scalars['String']['input'];
  status?: InputMaybe<Scalars['Int']['input']>;
  subject: Scalars['String']['input'];
  tenant?: InputMaybe<Scalars['String']['input']>;
};

export type CreateInverterMakeInput = {
  cecCapacity?: InputMaybe<Scalars['Float']['input']>;
  cecExpiryDate?: InputMaybe<Scalars['Date']['input']>;
  datasheetName?: InputMaybe<Scalars['String']['input']>;
  datasheetPath?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  make: Scalars['String']['input'];
  maxCapacity?: InputMaybe<Scalars['Float']['input']>;
  minCapacity?: InputMaybe<Scalars['Float']['input']>;
  productStatus?: InputMaybe<Scalars['Int']['input']>;
  shortName?: InputMaybe<Scalars['String']['input']>;
  totalCapacity?: InputMaybe<Scalars['Float']['input']>;
  usableCapacity?: InputMaybe<Scalars['Float']['input']>;
  warrantyDetails?: InputMaybe<Scalars['String']['input']>;
};

export type CreateInverterModelInput = {
  capacity?: InputMaybe<Scalars['Float']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  makeUid: Scalars['String']['input'];
  model: Scalars['String']['input'];
  warranty?: InputMaybe<Scalars['String']['input']>;
};

export type CreateLeadInput = {
  assignedToUid?: InputMaybe<Scalars['String']['input']>;
  branchTenant?: InputMaybe<Scalars['String']['input']>;
  buildingname?: InputMaybe<Scalars['String']['input']>;
  country?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  firstname: Scalars['String']['input'];
  flatorunittype?: InputMaybe<Scalars['String']['input']>;
  floorlevelnumber?: InputMaybe<Scalars['String']['input']>;
  fullAddress?: InputMaybe<Scalars['String']['input']>;
  gnafpid?: InputMaybe<Scalars['String']['input']>;
  housenumber?: InputMaybe<Scalars['String']['input']>;
  isCustomerNow?: InputMaybe<Scalars['Boolean']['input']>;
  isDuplicate?: InputMaybe<Scalars['Int']['input']>;
  lastname: Scalars['String']['input'];
  leadUid?: InputMaybe<Scalars['String']['input']>;
  nmi?: InputMaybe<Scalars['String']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  number?: InputMaybe<Scalars['String']['input']>;
  postcode?: InputMaybe<Scalars['String']['input']>;
  referralName?: InputMaybe<Scalars['String']['input']>;
  source?: InputMaybe<Scalars['String']['input']>;
  state?: InputMaybe<Scalars['String']['input']>;
  streetname?: InputMaybe<Scalars['String']['input']>;
  streetnumber?: InputMaybe<Scalars['String']['input']>;
  streettype?: InputMaybe<Scalars['String']['input']>;
  suburb?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  unitnumber?: InputMaybe<Scalars['String']['input']>;
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
  planUids?: InputMaybe<Array<Scalars['String']['input']>>;
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

export type CreatePlanInput = {
  bonusUids?: InputMaybe<Array<Scalars['String']['input']>>;
  contractTerm?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  discount?: InputMaybe<Scalars['Float']['input']>;
  exitFee?: InputMaybe<Scalars['Float']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  isBatteryRequired?: InputMaybe<Scalars['Boolean']['input']>;
  isSolarRequired?: InputMaybe<Scalars['Boolean']['input']>;
  propertyType?: InputMaybe<Scalars['Int']['input']>;
  ratesJson?: InputMaybe<Scalars['String']['input']>;
  title: Scalars['String']['input'];
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
  isIndependentUi?: InputMaybe<Scalars['Boolean']['input']>;
  isVisibleInLists?: InputMaybe<Scalars['Boolean']['input']>;
  name: Scalars['String']['input'];
  tenant?: InputMaybe<Scalars['String']['input']>;
};

export type CreateUserInput = {
  branchTenant?: InputMaybe<Scalars['String']['input']>;
  email: Scalars['String']['input'];
  ipAddress?: InputMaybe<Scalars['String']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  isAllowedWithoutIp?: InputMaybe<Scalars['Int']['input']>;
  isMaster?: InputMaybe<Scalars['Int']['input']>;
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
  assignedToUid?: Maybe<Scalars['String']['output']>;
  assignedToUser?: Maybe<User>;
  batteryDetails?: Maybe<CustomerBatterySystem>;
  branchTenant?: Maybe<Scalars['String']['output']>;
  businessName?: Maybe<Scalars['String']['output']>;
  checkCreditScore?: Maybe<Scalars['Int']['output']>;
  createdAt: Scalars['Date']['output'];
  createdBy?: Maybe<Scalars['String']['output']>;
  createdByUser?: Maybe<User>;
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
  isConsentRead?: Maybe<Scalars['Boolean']['output']>;
  isCreditScoreFetched?: Maybe<Scalars['Int']['output']>;
  isDeleted: Scalars['Boolean']['output'];
  isEnrollmentFinished?: Maybe<Scalars['Int']['output']>;
  isWithoutSignature?: Maybe<Scalars['Int']['output']>;
  lastName?: Maybe<Scalars['String']['output']>;
  leadUid?: Maybe<Scalars['String']['output']>;
  legalName?: Maybe<Scalars['String']['output']>;
  licenseDocument?: Maybe<CustomerDocument>;
  medicareCardType?: Maybe<Scalars['String']['output']>;
  medicareIrn?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  msatDetails?: Maybe<CustomerMsat>;
  number?: Maybe<Scalars['String']['output']>;
  offerEmailSentAt?: Maybe<Scalars['Date']['output']>;
  offerVersion?: Maybe<Scalars['Int']['output']>;
  pdfAudit?: Maybe<Scalars['String']['output']>;
  pdrsEmailSent?: Maybe<Scalars['Int']['output']>;
  pdrsEmailSentAt?: Maybe<Scalars['Date']['output']>;
  phoneVerifiedAt?: Maybe<Scalars['Date']['output']>;
  plan?: Maybe<Plan>;
  planUid?: Maybe<Scalars['String']['output']>;
  portalName?: Maybe<Scalars['String']['output']>;
  previousBill?: Maybe<CustomerDocument>;
  previousCustomerUid?: Maybe<Scalars['String']['output']>;
  propertyType?: Maybe<Scalars['Int']['output']>;
  rateOffer?: Maybe<RateOffer>;
  ratePlan?: Maybe<RatePlan>;
  ratePlanUid?: Maybe<Scalars['String']['output']>;
  rateVersion?: Maybe<Scalars['String']['output']>;
  referenceId?: Maybe<Scalars['String']['output']>;
  referralName?: Maybe<Scalars['String']['output']>;
  relationshipStatus?: Maybe<Scalars['Int']['output']>;
  riskStatus?: Maybe<Scalars['String']['output']>;
  selectedBonuses?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  showAsBusinessName?: Maybe<Scalars['Boolean']['output']>;
  showName?: Maybe<Scalars['Boolean']['output']>;
  signDate?: Maybe<Scalars['Date']['output']>;
  signatureUrl?: Maybe<Scalars['String']['output']>;
  signedConsent?: Maybe<Scalars['String']['output']>;
  signedConsentAt?: Maybe<Scalars['Date']['output']>;
  signedPdfPath?: Maybe<Scalars['String']['output']>;
  solarDetails?: Maybe<CustomerSolarSystem>;
  source?: Maybe<Scalars['String']['output']>;
  status?: Maybe<Scalars['Int']['output']>;
  tariffCode?: Maybe<Scalars['String']['output']>;
  tenant: Scalars['String']['output'];
  title?: Maybe<Scalars['String']['output']>;
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
  buildingName?: Maybe<Scalars['String']['output']>;
  country?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['Date']['output'];
  createdBy?: Maybe<Scalars['String']['output']>;
  customerUid: Scalars['String']['output'];
  deletedBy?: Maybe<Scalars['String']['output']>;
  dpid?: Maybe<Scalars['String']['output']>;
  flatOrUnitType?: Maybe<Scalars['String']['output']>;
  floorLevelNumber?: Maybe<Scalars['String']['output']>;
  fullAddress?: Maybe<Scalars['String']['output']>;
  gnafPid?: Maybe<Scalars['String']['output']>;
  houseNumber?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  isActive: Scalars['Boolean']['output'];
  isDeleted: Scalars['Boolean']['output'];
  nmi?: Maybe<Scalars['String']['output']>;
  ownershipStatus?: Maybe<Scalars['Int']['output']>;
  postcode?: Maybe<Scalars['String']['output']>;
  state?: Maybe<Scalars['String']['output']>;
  streetName?: Maybe<Scalars['String']['output']>;
  streetNumber?: Maybe<Scalars['String']['output']>;
  streetSuffix?: Maybe<Scalars['String']['output']>;
  streetType?: Maybe<Scalars['String']['output']>;
  suburb?: Maybe<Scalars['String']['output']>;
  unitNumber?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['Date']['output'];
  updatedBy?: Maybe<Scalars['String']['output']>;
};

export type CustomerAddressInput = {
  buildingName?: InputMaybe<Scalars['String']['input']>;
  country?: InputMaybe<Scalars['String']['input']>;
  dpid?: InputMaybe<Scalars['String']['input']>;
  flatOrUnitType?: InputMaybe<Scalars['String']['input']>;
  floorLevelNumber?: InputMaybe<Scalars['String']['input']>;
  gnafPid?: InputMaybe<Scalars['String']['input']>;
  houseNumber?: InputMaybe<Scalars['String']['input']>;
  nmi?: InputMaybe<Scalars['String']['input']>;
  ownershipStatus?: InputMaybe<Scalars['Int']['input']>;
  postcode?: InputMaybe<Scalars['String']['input']>;
  state?: InputMaybe<Scalars['String']['input']>;
  streetName?: InputMaybe<Scalars['String']['input']>;
  streetNumber?: InputMaybe<Scalars['String']['input']>;
  streetSuffix?: InputMaybe<Scalars['String']['input']>;
  streetType?: InputMaybe<Scalars['String']['input']>;
  suburb?: InputMaybe<Scalars['String']['input']>;
  unitNumber?: InputMaybe<Scalars['String']['input']>;
};

export type CustomerBatterySystem = {
  __typename?: 'CustomerBatterySystem';
  batterybrand?: Maybe<Scalars['String']['output']>;
  batterycapacity?: Maybe<Scalars['Float']['output']>;
  batterymodel?: Maybe<Scalars['String']['output']>;
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
  isbattery?: Maybe<Scalars['Int']['output']>;
  snnumber?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['Date']['output'];
  updatedBy?: Maybe<Scalars['String']['output']>;
};

export type CustomerBatterySystemInput = {
  batterybrand?: InputMaybe<Scalars['String']['input']>;
  batterycapacity?: InputMaybe<Scalars['Float']['input']>;
  batterymodel?: InputMaybe<Scalars['String']['input']>;
  checkCode?: InputMaybe<Scalars['String']['input']>;
  exportlimit?: InputMaybe<Scalars['Float']['input']>;
  inverterCapacity?: InputMaybe<Scalars['Float']['input']>;
  isbattery?: InputMaybe<Scalars['Int']['input']>;
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
  attachments?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
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
  licenseCardNumber?: Maybe<Scalars['String']['output']>;
  licenseExpiry?: Maybe<Scalars['Date']['output']>;
  licenseNumber?: Maybe<Scalars['String']['output']>;
  licenseState?: Maybe<Scalars['String']['output']>;
  lifesupport?: Maybe<Scalars['Int']['output']>;
  medicareCardType?: Maybe<Scalars['String']['output']>;
  medicareIrn?: Maybe<Scalars['String']['output']>;
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
  licenseCardNumber?: InputMaybe<Scalars['String']['input']>;
  licenseExpiry?: InputMaybe<Scalars['Date']['input']>;
  licenseNumber?: InputMaybe<Scalars['String']['input']>;
  licenseState?: InputMaybe<Scalars['String']['input']>;
  lifesupport?: InputMaybe<Scalars['Int']['input']>;
  medicareCardType?: InputMaybe<Scalars['String']['input']>;
  medicareIrn?: InputMaybe<Scalars['String']['input']>;
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

export type CustomerMaintenance = {
  __typename?: 'CustomerMaintenance';
  callDate: Scalars['Date']['output'];
  category?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['Date']['output'];
  createdBy?: Maybe<Scalars['String']['output']>;
  createdByName?: Maybe<Scalars['String']['output']>;
  customer?: Maybe<Customer>;
  customerUid: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  isActive?: Maybe<Scalars['Int']['output']>;
  isDeleted?: Maybe<Scalars['Int']['output']>;
  method?: Maybe<Scalars['Int']['output']>;
  notes?: Maybe<Scalars['String']['output']>;
  priority?: Maybe<Scalars['Int']['output']>;
  status?: Maybe<Scalars['Int']['output']>;
  takenCareByUid?: Maybe<Scalars['String']['output']>;
  takenCareByUser?: Maybe<User>;
  uid: Scalars['String']['output'];
  updatedAt: Scalars['Date']['output'];
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
  maintenanceUid?: Maybe<Scalars['String']['output']>;
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
  vpp?: Maybe<Scalars['Int']['output']>;
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
  utilmateApiPushed?: Maybe<Scalars['Int']['output']>;
  utilmateConnected?: Maybe<Scalars['Int']['output']>;
  utilmateConnectedAt?: Maybe<Scalars['Date']['output']>;
};

export type CustomerUtilmateInput = {
  accountNumber?: InputMaybe<Scalars['String']['input']>;
  siteIdentifier?: InputMaybe<Scalars['String']['input']>;
  utilmateApiPushed?: InputMaybe<Scalars['Int']['input']>;
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
  vppApiPushed?: Maybe<Scalars['Int']['output']>;
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
  vppApiPushed?: InputMaybe<Scalars['Int']['input']>;
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
  announcementUid?: Maybe<Scalars['String']['output']>;
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

export type InverterMake = {
  __typename?: 'InverterMake';
  cecCapacity?: Maybe<Scalars['Float']['output']>;
  cecExpiryDate?: Maybe<Scalars['Date']['output']>;
  createdAt: Scalars['Date']['output'];
  datasheetName?: Maybe<Scalars['String']['output']>;
  datasheetPath?: Maybe<Scalars['String']['output']>;
  datasheetUrl?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  isActive: Scalars['Boolean']['output'];
  make: Scalars['String']['output'];
  maxCapacity?: Maybe<Scalars['Float']['output']>;
  minCapacity?: Maybe<Scalars['Float']['output']>;
  productStatus?: Maybe<Scalars['Int']['output']>;
  shortName?: Maybe<Scalars['String']['output']>;
  tenant: Scalars['String']['output'];
  totalCapacity?: Maybe<Scalars['Float']['output']>;
  uid: Scalars['String']['output'];
  updatedAt: Scalars['Date']['output'];
  usableCapacity?: Maybe<Scalars['Float']['output']>;
  warrantyDetails?: Maybe<Scalars['String']['output']>;
};

export type InverterModel = {
  __typename?: 'InverterModel';
  capacity?: Maybe<Scalars['Float']['output']>;
  createdAt: Scalars['Date']['output'];
  id: Scalars['ID']['output'];
  isActive: Scalars['Boolean']['output'];
  makeUid: Scalars['String']['output'];
  model: Scalars['String']['output'];
  tenant: Scalars['String']['output'];
  uid: Scalars['String']['output'];
  updatedAt: Scalars['Date']['output'];
  warranty?: Maybe<Scalars['String']['output']>;
};

export type ItemCategory = {
  __typename?: 'ItemCategory';
  color?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['Date']['output'];
  createdBy?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  isActive?: Maybe<Scalars['Int']['output']>;
  isDeleted?: Maybe<Scalars['Int']['output']>;
  name: Scalars['String']['output'];
  tenant: Scalars['String']['output'];
  uid: Scalars['String']['output'];
  updatedAt: Scalars['Date']['output'];
  updatedBy?: Maybe<Scalars['String']['output']>;
};

export type Lead = {
  __typename?: 'Lead';
  assignedTo?: Maybe<Scalars['String']['output']>;
  assignedToUser?: Maybe<User>;
  branchTenant?: Maybe<Scalars['String']['output']>;
  buildingname?: Maybe<Scalars['String']['output']>;
  country?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['Date']['output'];
  createdBy?: Maybe<Scalars['String']['output']>;
  createdByUser?: Maybe<User>;
  customer?: Maybe<Customer>;
  customerUid?: Maybe<Scalars['String']['output']>;
  deletedBy?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  firstname?: Maybe<Scalars['String']['output']>;
  flatorunittype?: Maybe<Scalars['String']['output']>;
  floorlevelnumber?: Maybe<Scalars['String']['output']>;
  fullAddress?: Maybe<Scalars['String']['output']>;
  gnafpid?: Maybe<Scalars['String']['output']>;
  housenumber?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  isActive: Scalars['Boolean']['output'];
  isCustomerNow?: Maybe<Scalars['Boolean']['output']>;
  isDeleted: Scalars['Boolean']['output'];
  isDuplicate?: Maybe<Scalars['Int']['output']>;
  lastname?: Maybe<Scalars['String']['output']>;
  nmi?: Maybe<Scalars['String']['output']>;
  notes?: Maybe<Scalars['String']['output']>;
  number?: Maybe<Scalars['String']['output']>;
  postcode?: Maybe<Scalars['String']['output']>;
  referralName?: Maybe<Scalars['String']['output']>;
  source?: Maybe<Scalars['String']['output']>;
  state?: Maybe<Scalars['String']['output']>;
  streetname?: Maybe<Scalars['String']['output']>;
  streetnumber?: Maybe<Scalars['String']['output']>;
  streettype?: Maybe<Scalars['String']['output']>;
  suburb?: Maybe<Scalars['String']['output']>;
  tenant: Scalars['String']['output'];
  title?: Maybe<Scalars['String']['output']>;
  uid: Scalars['String']['output'];
  unitnumber?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['Date']['output'];
  updatedBy?: Maybe<Scalars['String']['output']>;
};

export type LeadSource = {
  __typename?: 'LeadSource';
  createdAt: Scalars['Date']['output'];
  createdBy?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  isActive?: Maybe<Scalars['Int']['output']>;
  isDeleted?: Maybe<Scalars['Int']['output']>;
  name: Scalars['String']['output'];
  tenant: Scalars['String']['output'];
  uid: Scalars['String']['output'];
  updatedAt: Scalars['Date']['output'];
  updatedBy?: Maybe<Scalars['String']['output']>;
};

export type LeadSourceDistribution = {
  __typename?: 'LeadSourceDistribution';
  count: Scalars['Int']['output'];
  percentage: Scalars['Float']['output'];
  source: Scalars['String']['output'];
};

export type LoginInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
  tenant?: InputMaybe<Scalars['String']['input']>;
};

export type MaintenanceStats = {
  __typename?: 'MaintenanceStats';
  cancelled: Scalars['Int']['output'];
  inProgress: Scalars['Int']['output'];
  resolved: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
};

export type MeasurementUnit = {
  __typename?: 'MeasurementUnit';
  createdAt: Scalars['Date']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  isActive: Scalars['Boolean']['output'];
  isDeleted: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  pdrsEmailSent?: Maybe<Scalars['Int']['output']>;
  pdrsEmailSentAt?: Maybe<Scalars['Date']['output']>;
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

export type MonthlyEnrollment = {
  __typename?: 'MonthlyEnrollment';
  count: Scalars['Int']['output'];
  month: Scalars['String']['output'];
  year: Scalars['Int']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  approveWebEnrollment: Customer;
  assignCustomer: Customer;
  changePassword: Scalars['Boolean']['output'];
  completeWebEnrollment: Scalars['Boolean']['output'];
  createBatteryMake: BatteryMake;
  createBatteryModel: BatteryModel;
  createBonus: Bonus;
  createCustomer: Customer;
  createCustomerMaintenance: CustomerMaintenance;
  createCustomerNote: CustomerNote;
  createDocumentType: DocumentType;
  createEmailTemplate: EmailTemplate;
  createInverterMake: InverterMake;
  createInverterModel: InverterModel;
  createItemCategory: ItemCategory;
  createLead: Lead;
  createLeadSource: LeadSource;
  createMeasurementUnit: MeasurementUnit;
  createMenu: Menu;
  createNoteType: NoteType;
  createNotificationEntity: NotificationEntity;
  createPdfTerm: PdfTerm;
  createPdrsCustomer: Customer;
  createPermission: RoleMenuPermission;
  createPlan: Plan;
  createRateOffer: RateOffer;
  createRatePlan: RatePlan;
  createRatesSnapshot: RatesHistoryRecord;
  createRiskStatus: RiskStatus;
  createRole: Role;
  createUser: User;
  deleteBatteryMake: Scalars['Boolean']['output'];
  deleteBatteryModel: Scalars['Boolean']['output'];
  deleteBonus: Scalars['Boolean']['output'];
  deleteCustomerMaintenance: Scalars['Boolean']['output'];
  deleteCustomerNote: Scalars['Boolean']['output'];
  deleteDocumentType: Scalars['Boolean']['output'];
  deleteInverterMake: Scalars['Boolean']['output'];
  deleteInverterModel: Scalars['Boolean']['output'];
  deleteItemCategory: Scalars['Boolean']['output'];
  deleteLead: Scalars['Boolean']['output'];
  deleteLeadSource: Scalars['Boolean']['output'];
  deleteMeasurementUnit: Scalars['Boolean']['output'];
  deleteNoteType: Scalars['Boolean']['output'];
  deleteNotificationEntity: Scalars['Boolean']['output'];
  deletePlan: Scalars['Boolean']['output'];
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
  markWebEnrollmentProcessed: Scalars['Boolean']['output'];
  refreshToken: AuthTokens;
  register: AuthTokens;
  rejectWebEnrollment: Scalars['Boolean']['output'];
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
  sendPdrsConsentEmail: SendEmailResult;
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
  updateBatteryMake: BatteryMake;
  updateBatteryModel: BatteryModel;
  updateBonus: Bonus;
  updateCustomer?: Maybe<Customer>;
  updateCustomerMaintenance?: Maybe<CustomerMaintenance>;
  updateCustomerNote: CustomerNote;
  updateDocumentType: DocumentType;
  updateEmailSetting: EmailSetting;
  updateEmailTemplate: EmailTemplate;
  updateInverterMake: InverterMake;
  updateInverterModel: InverterModel;
  updateItemCategory: ItemCategory;
  updateLead: Lead;
  updateLeadSource: LeadSource;
  updateMenu: Menu;
  updateNoteType: NoteType;
  updateNotificationEntity: NotificationEntity;
  updatePdfTerm: PdfTerm;
  updatePermission: RoleMenuPermission;
  updatePermissions: PermissionsUpdateResponse;
  updatePlan: Plan;
  updateRateOffer: RateOffer;
  updateRatePlan: RatePlan;
  updateRatePlans: Array<RatePlan>;
  updateRiskStatus: RiskStatus;
  updateRole: Role;
  updateUser: User;
  updateWebEnrollmentConsent: Scalars['Boolean']['output'];
  uploadFile: UploadFileResult;
  upsertRoleFeaturePermission: RoleFeaturePermission;
  upsertUserFeaturePermission: UserFeaturePermission;
  upsertUserPermission: UserMenuPermission;
  verifyEmailCode: EmailVerificationResult;
};


export type MutationApproveWebEnrollmentArgs = {
  uid: Scalars['String']['input'];
};


export type MutationAssignCustomerArgs = {
  uid: Scalars['String']['input'];
  userUid: Scalars['String']['input'];
};


export type MutationChangePasswordArgs = {
  input: ChangePasswordInput;
};


export type MutationCompleteWebEnrollmentArgs = {
  enrollmentData: Scalars['String']['input'];
  uid: Scalars['String']['input'];
};


export type MutationCreateBatteryMakeArgs = {
  input: CreateBatteryMakeInput;
};


export type MutationCreateBatteryModelArgs = {
  input: CreateBatteryModelInput;
};


export type MutationCreateBonusArgs = {
  input: CreateBonusInput;
};


export type MutationCreateCustomerArgs = {
  input: CreateCustomerInput;
};


export type MutationCreateCustomerMaintenanceArgs = {
  callDate: Scalars['Date']['input'];
  category?: InputMaybe<Scalars['String']['input']>;
  customerUid: Scalars['String']['input'];
  method?: InputMaybe<Scalars['Int']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  priority?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<Scalars['Int']['input']>;
  takenCareByUid?: InputMaybe<Scalars['String']['input']>;
};


export type MutationCreateCustomerNoteArgs = {
  assignedTo?: InputMaybe<Scalars['String']['input']>;
  customerUid: Scalars['String']['input'];
  followUp?: InputMaybe<Scalars['Date']['input']>;
  maintenanceUid?: InputMaybe<Scalars['String']['input']>;
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


export type MutationCreateInverterMakeArgs = {
  input: CreateInverterMakeInput;
};


export type MutationCreateInverterModelArgs = {
  input: CreateInverterModelInput;
};


export type MutationCreateItemCategoryArgs = {
  color?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};


export type MutationCreateLeadArgs = {
  input: CreateLeadInput;
};


export type MutationCreateLeadSourceArgs = {
  name: Scalars['String']['input'];
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


export type MutationCreatePdrsCustomerArgs = {
  input: CreateCustomerInput;
};


export type MutationCreatePermissionArgs = {
  input: CreatePermissionInput;
};


export type MutationCreatePlanArgs = {
  input: CreatePlanInput;
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


export type MutationDeleteBatteryMakeArgs = {
  uid: Scalars['String']['input'];
};


export type MutationDeleteBatteryModelArgs = {
  uid: Scalars['String']['input'];
};


export type MutationDeleteBonusArgs = {
  uid: Scalars['String']['input'];
};


export type MutationDeleteCustomerMaintenanceArgs = {
  uid: Scalars['String']['input'];
};


export type MutationDeleteCustomerNoteArgs = {
  uid: Scalars['String']['input'];
};


export type MutationDeleteDocumentTypeArgs = {
  uid: Scalars['String']['input'];
};


export type MutationDeleteInverterMakeArgs = {
  uid: Scalars['String']['input'];
};


export type MutationDeleteInverterModelArgs = {
  uid: Scalars['String']['input'];
};


export type MutationDeleteItemCategoryArgs = {
  uid: Scalars['String']['input'];
};


export type MutationDeleteLeadArgs = {
  uid: Scalars['String']['input'];
};


export type MutationDeleteLeadSourceArgs = {
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


export type MutationDeletePlanArgs = {
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


export type MutationMarkWebEnrollmentProcessedArgs = {
  uid: Scalars['String']['input'];
};


export type MutationRefreshTokenArgs = {
  refreshToken: Scalars['String']['input'];
};


export type MutationRegisterArgs = {
  input: RegisterInput;
};


export type MutationRejectWebEnrollmentArgs = {
  uid: Scalars['String']['input'];
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


export type MutationSendPdrsConsentEmailArgs = {
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


export type MutationUpdateBatteryMakeArgs = {
  input: UpdateBatteryMakeInput;
  uid: Scalars['String']['input'];
};


export type MutationUpdateBatteryModelArgs = {
  input: UpdateBatteryModelInput;
  uid: Scalars['String']['input'];
};


export type MutationUpdateBonusArgs = {
  input: UpdateBonusInput;
  uid: Scalars['String']['input'];
};


export type MutationUpdateCustomerArgs = {
  input: UpdateCustomerInput;
  uid: Scalars['String']['input'];
};


export type MutationUpdateCustomerMaintenanceArgs = {
  category?: InputMaybe<Scalars['String']['input']>;
  method?: InputMaybe<Scalars['Int']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  priority?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<Scalars['Int']['input']>;
  takenCareByUid?: InputMaybe<Scalars['String']['input']>;
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


export type MutationUpdateInverterMakeArgs = {
  input: UpdateInverterMakeInput;
  uid: Scalars['String']['input'];
};


export type MutationUpdateInverterModelArgs = {
  input: UpdateInverterModelInput;
  uid: Scalars['String']['input'];
};


export type MutationUpdateItemCategoryArgs = {
  color?: InputMaybe<Scalars['String']['input']>;
  isActive?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  uid: Scalars['String']['input'];
};


export type MutationUpdateLeadArgs = {
  input: UpdateLeadInput;
  uid: Scalars['String']['input'];
};


export type MutationUpdateLeadSourceArgs = {
  isActive?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
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


export type MutationUpdatePlanArgs = {
  input: UpdatePlanInput;
  uid: Scalars['String']['input'];
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


export type MutationUpdateWebEnrollmentConsentArgs = {
  isRead: Scalars['Boolean']['input'];
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

export type PaginatedLeads = {
  __typename?: 'PaginatedLeads';
  data: Array<Lead>;
  meta: PaginationMeta;
};

export type PaginatedMaintenances = {
  __typename?: 'PaginatedMaintenances';
  data: Array<CustomerMaintenance>;
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

export type PaginatedWebEnrollments = {
  __typename?: 'PaginatedWebEnrollments';
  data: Array<WebEnrollment>;
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
  planUids?: Maybe<Array<Scalars['String']['output']>>;
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

export type Plan = {
  __typename?: 'Plan';
  bonusUids?: Maybe<Array<Scalars['String']['output']>>;
  bonuses?: Maybe<Array<Bonus>>;
  contractTerm?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['Date']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  discount?: Maybe<Scalars['Float']['output']>;
  exitFee?: Maybe<Scalars['Float']['output']>;
  isActive: Scalars['Boolean']['output'];
  isBatteryRequired?: Maybe<Scalars['Boolean']['output']>;
  isSolarRequired?: Maybe<Scalars['Boolean']['output']>;
  propertyType?: Maybe<Scalars['Int']['output']>;
  ratesJson?: Maybe<Scalars['String']['output']>;
  tenant: Scalars['String']['output'];
  title: Scalars['String']['output'];
  uid: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['Date']['output']>;
};

export type Query = {
  __typename?: 'Query';
  activeBonuses: Array<Bonus>;
  activePlans: Array<Plan>;
  activeRatesHistory?: Maybe<RatesHistoryRecord>;
  allEmailLogs: PaginatedEmailLogs;
  announcements: Array<Announcement>;
  auditLog?: Maybe<AuditLog>;
  auditLogs: PaginatedAuditLogs;
  batteryMakes: Array<BatteryMake>;
  batteryModels: Array<BatteryModel>;
  bonus?: Maybe<Bonus>;
  bonuses: Array<Bonus>;
  checkAddressExists?: Maybe<Customer>;
  checkLeadDuplicate?: Maybe<Lead>;
  checkNmiExists?: Maybe<Customer>;
  customer?: Maybe<Customer>;
  customerByCustomerId?: Maybe<Customer>;
  customerDashboard: CustomerDashboardSummary;
  customerEmailLogs: PaginatedEmailLogs;
  customerMaintenance: Array<CustomerMaintenance>;
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
  getNextCustomerId: Scalars['String']['output'];
  getPricingAnnouncementHtml: Scalars['String']['output'];
  globalActiveRatesHistory?: Maybe<RatesHistoryRecord>;
  hasRatesChanges: RatesChangesResponse;
  inverterMakes: Array<InverterMake>;
  inverterModels: Array<InverterModel>;
  itemCategories: Array<ItemCategory>;
  lead?: Maybe<Lead>;
  leadSourceDistribution: Array<LeadSourceDistribution>;
  leadSources: Array<LeadSource>;
  leads: PaginatedLeads;
  maintenanceRecord?: Maybe<CustomerMaintenance>;
  maintenanceStats: MaintenanceStats;
  maintenances: PaginatedMaintenances;
  me?: Maybe<User>;
  measurementUnits: Array<MeasurementUnit>;
  menu?: Maybe<Menu>;
  menus: PaginatedMenus;
  monthlyEnrollments: Array<MonthlyEnrollment>;
  noteTypes: Array<NoteType>;
  notificationEntities: Array<NotificationEntity>;
  notificationEntity?: Maybe<NotificationEntity>;
  pdfTerm?: Maybe<PdfTerm>;
  pdfTermsList: PaginatedPdfTerms;
  peerlessCompanyNames: Array<Scalars['String']['output']>;
  permission?: Maybe<RoleMenuPermission>;
  plan?: Maybe<Plan>;
  plans: Array<Plan>;
  previewSystemTemplate: SystemTemplatePreview;
  rateOffer?: Maybe<RateOffer>;
  rateOffers: PaginatedRateOffers;
  ratePlan?: Maybe<RatePlan>;
  ratePlanByCode?: Maybe<RatePlan>;
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
  webEnrollmentByUid?: Maybe<WebEnrollment>;
  webEnrollments: PaginatedWebEnrollments;
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


export type QueryBatteryModelsArgs = {
  makeUid: Scalars['String']['input'];
};


export type QueryBonusArgs = {
  uid: Scalars['String']['input'];
};


export type QueryCheckAddressExistsArgs = {
  address: CustomerAddressInput;
};


export type QueryCheckLeadDuplicateArgs = {
  address?: InputMaybe<CustomerAddressInput>;
  number?: InputMaybe<Scalars['String']['input']>;
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


export type QueryCustomerMaintenanceArgs = {
  customerUid: Scalars['String']['input'];
};


export type QueryCustomerNotesArgs = {
  customerUid: Scalars['String']['input'];
  maintenanceUid?: InputMaybe<Scalars['String']['input']>;
};


export type QueryCustomersArgs = {
  discount?: InputMaybe<Scalars['Float']['input']>;
  includeDeleted?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  searchAssignedTo?: InputMaybe<Scalars['String']['input']>;
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
  searchAssignedTo?: InputMaybe<Scalars['String']['input']>;
  searchDiscount?: InputMaybe<Scalars['Int']['input']>;
  searchDnsp?: InputMaybe<Scalars['String']['input']>;
  searchId?: InputMaybe<Scalars['String']['input']>;
  searchMobile?: InputMaybe<Scalars['String']['input']>;
  searchMsatConnected?: InputMaybe<Scalars['Int']['input']>;
  searchName?: InputMaybe<Scalars['String']['input']>;
  searchPortal?: InputMaybe<Scalars['String']['input']>;
  searchRiskStatus?: InputMaybe<Scalars['String']['input']>;
  searchSigned?: InputMaybe<Scalars['Int']['input']>;
  searchStatus?: InputMaybe<Scalars['Int']['input']>;
  searchTariff?: InputMaybe<Scalars['String']['input']>;
  searchUtilmateApiPushed?: InputMaybe<Scalars['Int']['input']>;
  searchUtilmateStatus?: InputMaybe<Scalars['Int']['input']>;
  searchVpp?: InputMaybe<Scalars['Int']['input']>;
  searchVppApiPushed?: InputMaybe<Scalars['Int']['input']>;
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


export type QueryGetPricingAnnouncementHtmlArgs = {
  uid: Scalars['String']['input'];
};


export type QueryInverterModelsArgs = {
  makeUid: Scalars['String']['input'];
};


export type QueryLeadArgs = {
  uid: Scalars['String']['input'];
};


export type QueryLeadsArgs = {
  branchTenant?: InputMaybe<Scalars['String']['input']>;
  customerStatus?: InputMaybe<Scalars['Int']['input']>;
  isCustomerNow?: InputMaybe<Scalars['Boolean']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  searchAssignedTo?: InputMaybe<Scalars['String']['input']>;
  searchCreatedBy?: InputMaybe<Scalars['String']['input']>;
  source?: InputMaybe<Scalars['String']['input']>;
};


export type QueryMaintenanceRecordArgs = {
  uid: Scalars['String']['input'];
};


export type QueryMaintenancesArgs = {
  category?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  priority?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryMenuArgs = {
  uid: Scalars['String']['input'];
};


export type QueryMenusArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryMonthlyEnrollmentsArgs = {
  months?: InputMaybe<Scalars['Int']['input']>;
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


export type QueryPlanArgs = {
  uid: Scalars['String']['input'];
};


export type QueryPlansArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryPreviewSystemTemplateArgs = {
  eventType: Scalars['String']['input'];
  isWithoutSignature?: InputMaybe<Scalars['Boolean']['input']>;
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


export type QueryRatePlanByCodeArgs = {
  code: Scalars['String']['input'];
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
  isVisibleInLists?: InputMaybe<Scalars['Boolean']['input']>;
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
  branchTenant?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  onlyVisibleRoles?: InputMaybe<Scalars['Boolean']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  roleUid?: InputMaybe<Scalars['String']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  topLevelOnly?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryValidateCustomerAccessCodeArgs = {
  code: Scalars['String']['input'];
  customerId: Scalars['String']['input'];
};


export type QueryWebEnrollmentByUidArgs = {
  uid: Scalars['String']['input'];
};


export type QueryWebEnrollmentsArgs = {
  branchTenant?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  processed?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  searchAddress?: InputMaybe<Scalars['String']['input']>;
  searchCompanyName?: InputMaybe<Scalars['String']['input']>;
  searchEmail?: InputMaybe<Scalars['String']['input']>;
  searchMobile?: InputMaybe<Scalars['String']['input']>;
  searchName?: InputMaybe<Scalars['String']['input']>;
  searchNmi?: InputMaybe<Scalars['String']['input']>;
  searchPortal?: InputMaybe<Scalars['String']['input']>;
  searchTariff?: InputMaybe<Scalars['String']['input']>;
  searchVpp?: InputMaybe<Scalars['Int']['input']>;
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
  isIndependentUi?: Maybe<Scalars['Boolean']['output']>;
  isVisibleInLists?: Maybe<Scalars['Boolean']['output']>;
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
  isCustom: Scalars['Boolean']['output'];
  subject: Scalars['String']['output'];
};

export type UpdateBatteryMakeInput = {
  actualModelRows?: InputMaybe<Scalars['Int']['input']>;
  batteryCapacityKwh?: InputMaybe<Scalars['Float']['input']>;
  batteryProdWarranty?: InputMaybe<Scalars['String']['input']>;
  batteryUsableCapacity?: InputMaybe<Scalars['Float']['input']>;
  cecStatus?: InputMaybe<Scalars['Int']['input']>;
  cegCapacity?: InputMaybe<Scalars['Float']['input']>;
  cegExpiryDate?: InputMaybe<Scalars['Date']['input']>;
  datasheetName?: InputMaybe<Scalars['String']['input']>;
  datasheetPath?: InputMaybe<Scalars['String']['input']>;
  declaredModelCount?: InputMaybe<Scalars['Int']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  make?: InputMaybe<Scalars['String']['input']>;
  maxBackupLoad?: InputMaybe<Scalars['Float']['input']>;
  maxCapacity?: InputMaybe<Scalars['Float']['input']>;
  minCapacity?: InputMaybe<Scalars['Float']['input']>;
  pdrsStatus?: InputMaybe<Scalars['Int']['input']>;
  productStatus?: InputMaybe<Scalars['Int']['input']>;
  shortName?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateBatteryModelInput = {
  bess2Eligible?: InputMaybe<Scalars['Int']['input']>;
  capacity?: InputMaybe<Scalars['Float']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  makeUid?: InputMaybe<Scalars['String']['input']>;
  model?: InputMaybe<Scalars['String']['input']>;
  vpp1Eligible?: InputMaybe<Scalars['Int']['input']>;
  vppProgram?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateBonusInput = {
  amount?: InputMaybe<Scalars['Float']['input']>;
  contractTerm?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  exitFee?: InputMaybe<Scalars['Float']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateCustomerInput = {
  abn?: InputMaybe<Scalars['String']['input']>;
  address?: InputMaybe<CustomerAddressInput>;
  assignedToUid?: InputMaybe<Scalars['String']['input']>;
  batteryDetails?: InputMaybe<CustomerBatterySystemInput>;
  branchTenant?: InputMaybe<Scalars['String']['input']>;
  businessName?: InputMaybe<Scalars['String']['input']>;
  checkCreditScore?: InputMaybe<Scalars['Int']['input']>;
  consentSignatureBase64?: InputMaybe<Scalars['String']['input']>;
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
  isEnrollmentFinished?: InputMaybe<Scalars['Int']['input']>;
  isWithoutSignature?: InputMaybe<Scalars['Boolean']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  leadUid?: InputMaybe<Scalars['String']['input']>;
  legalName?: InputMaybe<Scalars['String']['input']>;
  licenseDocument?: InputMaybe<Scalars['String']['input']>;
  medicareCardType?: InputMaybe<Scalars['String']['input']>;
  medicareIrn?: InputMaybe<Scalars['String']['input']>;
  msatDetails?: InputMaybe<CustomerMsatInput>;
  number?: InputMaybe<Scalars['String']['input']>;
  offerEmailSentAt?: InputMaybe<Scalars['Date']['input']>;
  pdfAudit?: InputMaybe<Scalars['String']['input']>;
  pdrsEmailSent?: InputMaybe<Scalars['Int']['input']>;
  pdrsEmailSentAt?: InputMaybe<Scalars['Date']['input']>;
  phoneVerifiedAt?: InputMaybe<Scalars['Date']['input']>;
  planUid?: InputMaybe<Scalars['String']['input']>;
  portalName?: InputMaybe<Scalars['String']['input']>;
  previousBill?: InputMaybe<Scalars['String']['input']>;
  propertyType?: InputMaybe<Scalars['Int']['input']>;
  ratePlanUid?: InputMaybe<Scalars['String']['input']>;
  rateVersion?: InputMaybe<Scalars['String']['input']>;
  referralName?: InputMaybe<Scalars['String']['input']>;
  relationshipStatus?: InputMaybe<Scalars['Int']['input']>;
  riskStatus?: InputMaybe<Scalars['String']['input']>;
  selectedBonuses?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  showAsBusinessName?: InputMaybe<Scalars['Boolean']['input']>;
  showName?: InputMaybe<Scalars['Boolean']['input']>;
  signDate?: InputMaybe<Scalars['Date']['input']>;
  signatureBase64?: InputMaybe<Scalars['String']['input']>;
  signatureUrl?: InputMaybe<Scalars['String']['input']>;
  signedConsent?: InputMaybe<Scalars['String']['input']>;
  signedConsentAt?: InputMaybe<Scalars['Date']['input']>;
  signedPdfPath?: InputMaybe<Scalars['String']['input']>;
  skipStatusUpdate?: InputMaybe<Scalars['Boolean']['input']>;
  solarDetails?: InputMaybe<CustomerSolarSystemInput>;
  source?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['Int']['input']>;
  tariffCode?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  triggerUpdateEmail?: InputMaybe<Scalars['Boolean']['input']>;
  triggerWelcomeEmail?: InputMaybe<Scalars['Boolean']['input']>;
  utilmateDetails?: InputMaybe<CustomerUtilmateInput>;
  utilmateStatus?: InputMaybe<Scalars['Int']['input']>;
  utilmateUpdatedAt?: InputMaybe<Scalars['Date']['input']>;
  utilmateUploadedManually?: InputMaybe<Scalars['Int']['input']>;
  vppCertificateDetails?: InputMaybe<CustomerVppCertificateDetailsInput>;
  vppDetails?: InputMaybe<CustomerVppInput>;
};

export type UpdateEmailTemplateInput = {
  announcementUid?: InputMaybe<Scalars['String']['input']>;
  body?: InputMaybe<Scalars['String']['input']>;
  entityType?: InputMaybe<Scalars['Int']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['Int']['input']>;
  subject?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateInverterMakeInput = {
  cecCapacity?: InputMaybe<Scalars['Float']['input']>;
  cecExpiryDate?: InputMaybe<Scalars['Date']['input']>;
  datasheetName?: InputMaybe<Scalars['String']['input']>;
  datasheetPath?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  make?: InputMaybe<Scalars['String']['input']>;
  maxCapacity?: InputMaybe<Scalars['Float']['input']>;
  minCapacity?: InputMaybe<Scalars['Float']['input']>;
  productStatus?: InputMaybe<Scalars['Int']['input']>;
  shortName?: InputMaybe<Scalars['String']['input']>;
  totalCapacity?: InputMaybe<Scalars['Float']['input']>;
  usableCapacity?: InputMaybe<Scalars['Float']['input']>;
  warrantyDetails?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateInverterModelInput = {
  capacity?: InputMaybe<Scalars['Float']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  makeUid?: InputMaybe<Scalars['String']['input']>;
  model?: InputMaybe<Scalars['String']['input']>;
  warranty?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateLeadInput = {
  assignedToUid?: InputMaybe<Scalars['String']['input']>;
  branchTenant?: InputMaybe<Scalars['String']['input']>;
  buildingname?: InputMaybe<Scalars['String']['input']>;
  country?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  firstname?: InputMaybe<Scalars['String']['input']>;
  flatorunittype?: InputMaybe<Scalars['String']['input']>;
  floorlevelnumber?: InputMaybe<Scalars['String']['input']>;
  fullAddress?: InputMaybe<Scalars['String']['input']>;
  gnafpid?: InputMaybe<Scalars['String']['input']>;
  housenumber?: InputMaybe<Scalars['String']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  isCustomerNow?: InputMaybe<Scalars['Boolean']['input']>;
  isDuplicate?: InputMaybe<Scalars['Int']['input']>;
  lastname?: InputMaybe<Scalars['String']['input']>;
  leadUid?: InputMaybe<Scalars['String']['input']>;
  nmi?: InputMaybe<Scalars['String']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  number?: InputMaybe<Scalars['String']['input']>;
  postcode?: InputMaybe<Scalars['String']['input']>;
  referralName?: InputMaybe<Scalars['String']['input']>;
  source?: InputMaybe<Scalars['String']['input']>;
  state?: InputMaybe<Scalars['String']['input']>;
  streetname?: InputMaybe<Scalars['String']['input']>;
  streetnumber?: InputMaybe<Scalars['String']['input']>;
  streettype?: InputMaybe<Scalars['String']['input']>;
  suburb?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  unitnumber?: InputMaybe<Scalars['String']['input']>;
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
  planUids?: InputMaybe<Array<Scalars['String']['input']>>;
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

export type UpdatePlanInput = {
  bonusUids?: InputMaybe<Array<Scalars['String']['input']>>;
  contractTerm?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  discount?: InputMaybe<Scalars['Float']['input']>;
  exitFee?: InputMaybe<Scalars['Float']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  isBatteryRequired?: InputMaybe<Scalars['Boolean']['input']>;
  isSolarRequired?: InputMaybe<Scalars['Boolean']['input']>;
  propertyType?: InputMaybe<Scalars['Int']['input']>;
  ratesJson?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
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
  isIndependentUi?: InputMaybe<Scalars['Boolean']['input']>;
  isVisibleInLists?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateUserInput = {
  branchTenant?: InputMaybe<Scalars['String']['input']>;
  ipAddress?: InputMaybe<Scalars['String']['input']>;
  isAllowedWithoutIp?: InputMaybe<Scalars['Int']['input']>;
  isMaster?: InputMaybe<Scalars['Int']['input']>;
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
  branchStaff?: Maybe<Array<User>>;
  branchTenant?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['Date']['output'];
  createdBy?: Maybe<Scalars['String']['output']>;
  deletedBy?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  ipAddress?: Maybe<Scalars['String']['output']>;
  isActive: Scalars['Boolean']['output'];
  isAllowedWithoutIp?: Maybe<Scalars['Int']['output']>;
  isDeleted: Scalars['Boolean']['output'];
  isIndependentUi?: Maybe<Scalars['Boolean']['output']>;
  isMaster?: Maybe<Scalars['Int']['output']>;
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

export type WebEnrollment = {
  __typename?: 'WebEnrollment';
  branchTenant?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['Date']['output'];
  id: Scalars['ID']['output'];
  isConsentRead?: Maybe<Scalars['Int']['output']>;
  isEnrollmentFinished?: Maybe<Scalars['Int']['output']>;
  medicareCardType?: Maybe<Scalars['String']['output']>;
  medicareIrn?: Maybe<Scalars['String']['output']>;
  payload: Scalars['JSON']['output'];
  processed: Scalars['Int']['output'];
  referenceId?: Maybe<Scalars['String']['output']>;
  uid: Scalars['String']['output'];
};

export type CustomerBasicFieldsFragment = { __typename?: 'Customer', uid: string, customerId?: string | null, firstName?: string | null, lastName?: string | null, email?: string | null, number?: string | null, status?: number | null, createdAt: any, updatedAt: any } & { ' $fragmentName'?: 'CustomerBasicFieldsFragment' };

export type CustomerAddressFieldsFragment = { __typename?: 'CustomerAddress', id: string, streetName?: string | null, suburb?: string | null, state?: string | null, postcode?: string | null, country?: string | null } & { ' $fragmentName'?: 'CustomerAddressFieldsFragment' };

export type UserFieldsFragment = { __typename?: 'User', uid: string, email?: string | null, password?: string | null, name?: string | null, number?: string | null, tenant: string, roleUid?: string | null, roleName?: string | null, status: UserStatus, isActive: boolean, isDeleted: boolean, createdAt: any, ipAddress?: string | null, isAllowedWithoutIp?: number | null, isMaster?: number | null, branchTenant?: string | null, message?: string | null } & { ' $fragmentName'?: 'UserFieldsFragment' };

export type RatePlanFieldsFragment = { __typename?: 'RatePlan', uid: string, tenant: string, codes?: string | null, planId?: string | null, dnsp?: number | null, state?: string | null, tariff?: string | null, type?: number | null, vpp?: number | null, discountApplies?: number | null, discountPercentage?: number | null, isActive: boolean, isDeleted: boolean, createdAt: any, updatedAt: any, createdBy?: string | null, updatedBy?: string | null, message?: string | null } & { ' $fragmentName'?: 'RatePlanFieldsFragment' };

export type RateOfferFieldsFragment = { __typename?: 'RateOffer', uid: string, ratePlanUid: string, tenant: string, offerName?: string | null, anytime?: number | null, cl1Supply?: number | null, cl1Usage?: number | null, cl2Supply?: number | null, cl2Usage?: number | null, demand?: number | null, demandOp?: number | null, demandP?: number | null, demandS?: number | null, fit?: number | null, fitPeak?: number | null, fitCritical?: number | null, fitVpp?: number | null, offPeak?: number | null, peak?: number | null, shoulder?: number | null, supplyCharge?: number | null, vppOrcharge?: number | null, dynamicRates?: Record<string, unknown> | null, priceUnits?: Record<string, unknown> | null, isActive: boolean, isDeleted: boolean, createdAt: any, updatedAt: any, createdBy?: string | null, updatedBy?: string | null } & { ' $fragmentName'?: 'RateOfferFieldsFragment' };

export type LeadFieldsFragment = { __typename?: 'Lead', uid: string, title?: string | null, firstname?: string | null, lastname?: string | null, email?: string | null, number?: string | null, source?: string | null, notes?: string | null, unitnumber?: string | null, flatorunittype?: string | null, gnafpid?: string | null, housenumber?: string | null, buildingname?: string | null, floorlevelnumber?: string | null, streetnumber?: string | null, streetname?: string | null, streettype?: string | null, suburb?: string | null, postcode?: string | null, state?: string | null, country?: string | null, nmi?: string | null, fullAddress?: string | null, referralName?: string | null, isActive: boolean, isDeleted: boolean, createdAt: any, updatedAt: any, assignedTo?: string | null, branchTenant?: string | null, customerUid?: string | null, isCustomerNow?: boolean | null, isDuplicate?: number | null, assignedToUser?: { __typename?: 'User', uid: string, name?: string | null } | null, createdByUser?: { __typename?: 'User', uid: string, name?: string | null } | null, customer?: { __typename?: 'Customer', status?: number | null } | null } & { ' $fragmentName'?: 'LeadFieldsFragment' };

export type LoginMutationVariables = Exact<{
  input: LoginInput;
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'AuthTokens', accessToken: string, refreshToken: string, message?: string | null } };

export type RefreshTokenMutationVariables = Exact<{
  refreshToken: Scalars['String']['input'];
}>;


export type RefreshTokenMutation = { __typename?: 'Mutation', refreshToken: { __typename?: 'AuthTokens', accessToken: string, refreshToken: string } };

export type CreateBatteryMakeMutationVariables = Exact<{
  input: CreateBatteryMakeInput;
}>;


export type CreateBatteryMakeMutation = { __typename?: 'Mutation', createBatteryMake: { __typename?: 'BatteryMake', uid: string, make: string, shortName?: string | null, description?: string | null, batteryUsableCapacity?: number | null, maxBackupLoad?: number | null, batteryProdWarranty?: string | null, productStatus?: number | null, cecStatus?: number | null, pdrsStatus?: number | null, cegCapacity?: number | null, batteryCapacityKwh?: number | null, cegExpiryDate?: any | null, declaredModelCount?: number | null, actualModelRows?: number | null, minCapacity?: number | null, maxCapacity?: number | null, isActive: boolean, datasheetPath?: string | null, datasheetUrl?: string | null, datasheetName?: string | null } };

export type UpdateBatteryMakeMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  input: UpdateBatteryMakeInput;
}>;


export type UpdateBatteryMakeMutation = { __typename?: 'Mutation', updateBatteryMake: { __typename?: 'BatteryMake', uid: string, make: string, shortName?: string | null, description?: string | null, batteryUsableCapacity?: number | null, maxBackupLoad?: number | null, batteryProdWarranty?: string | null, productStatus?: number | null, cecStatus?: number | null, pdrsStatus?: number | null, cegCapacity?: number | null, batteryCapacityKwh?: number | null, cegExpiryDate?: any | null, declaredModelCount?: number | null, actualModelRows?: number | null, minCapacity?: number | null, maxCapacity?: number | null, isActive: boolean, datasheetPath?: string | null, datasheetUrl?: string | null, datasheetName?: string | null } };

export type DeleteBatteryMakeMutationVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type DeleteBatteryMakeMutation = { __typename?: 'Mutation', deleteBatteryMake: boolean };

export type CreateBatteryModelMutationVariables = Exact<{
  input: CreateBatteryModelInput;
}>;


export type CreateBatteryModelMutation = { __typename?: 'Mutation', createBatteryModel: { __typename?: 'BatteryModel', id: string, uid: string, makeUid: string, model: string, capacity?: number | null, vppProgram?: string | null, bess2Eligible?: number | null, vpp1Eligible?: number | null, isActive: boolean } };

export type UpdateBatteryModelMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  input: UpdateBatteryModelInput;
}>;


export type UpdateBatteryModelMutation = { __typename?: 'Mutation', updateBatteryModel: { __typename?: 'BatteryModel', id: string, uid: string, makeUid: string, model: string, capacity?: number | null, vppProgram?: string | null, bess2Eligible?: number | null, vpp1Eligible?: number | null, isActive: boolean } };

export type DeleteBatteryModelMutationVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type DeleteBatteryModelMutation = { __typename?: 'Mutation', deleteBatteryModel: boolean };

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

export type CreateInverterMakeMutationVariables = Exact<{
  input: CreateInverterMakeInput;
}>;


export type CreateInverterMakeMutation = { __typename?: 'Mutation', createInverterMake: { __typename?: 'InverterMake', uid: string, make: string, shortName?: string | null, description?: string | null, minCapacity?: number | null, maxCapacity?: number | null, totalCapacity?: number | null, usableCapacity?: number | null, warrantyDetails?: string | null, productStatus?: number | null, cecCapacity?: number | null, cecExpiryDate?: any | null, isActive: boolean, datasheetPath?: string | null, datasheetUrl?: string | null, datasheetName?: string | null } };

export type UpdateInverterMakeMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  input: UpdateInverterMakeInput;
}>;


export type UpdateInverterMakeMutation = { __typename?: 'Mutation', updateInverterMake: { __typename?: 'InverterMake', uid: string, make: string, shortName?: string | null, description?: string | null, minCapacity?: number | null, maxCapacity?: number | null, totalCapacity?: number | null, usableCapacity?: number | null, warrantyDetails?: string | null, productStatus?: number | null, cecCapacity?: number | null, cecExpiryDate?: any | null, isActive: boolean, datasheetPath?: string | null, datasheetUrl?: string | null, datasheetName?: string | null } };

export type DeleteInverterMakeMutationVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type DeleteInverterMakeMutation = { __typename?: 'Mutation', deleteInverterMake: boolean };

export type CreateInverterModelMutationVariables = Exact<{
  input: CreateInverterModelInput;
}>;


export type CreateInverterModelMutation = { __typename?: 'Mutation', createInverterModel: { __typename?: 'InverterModel', uid: string, makeUid: string, model: string, capacity?: number | null, warranty?: string | null, isActive: boolean } };

export type UpdateInverterModelMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  input: UpdateInverterModelInput;
}>;


export type UpdateInverterModelMutation = { __typename?: 'Mutation', updateInverterModel: { __typename?: 'InverterModel', uid: string, makeUid: string, model: string, capacity?: number | null, warranty?: string | null, isActive: boolean } };

export type DeleteInverterModelMutationVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type DeleteInverterModelMutation = { __typename?: 'Mutation', deleteInverterModel: boolean };

export type CreateLeadMutationVariables = Exact<{
  input: CreateLeadInput;
}>;


export type CreateLeadMutation = { __typename?: 'Mutation', createLead: (
    { __typename?: 'Lead' }
    & { ' $fragmentRefs'?: { 'LeadFieldsFragment': LeadFieldsFragment } }
  ) };

export type UpdateLeadMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  input: UpdateLeadInput;
}>;


export type UpdateLeadMutation = { __typename?: 'Mutation', updateLead: (
    { __typename?: 'Lead' }
    & { ' $fragmentRefs'?: { 'LeadFieldsFragment': LeadFieldsFragment } }
  ) };

export type DeleteLeadMutationVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type DeleteLeadMutation = { __typename?: 'Mutation', deleteLead: boolean };

export type CreateLeadSourceMutationVariables = Exact<{
  name: Scalars['String']['input'];
}>;


export type CreateLeadSourceMutation = { __typename?: 'Mutation', createLeadSource: { __typename?: 'LeadSource', id: string, uid: string, name: string } };

export type UpdateLeadSourceMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  isActive?: InputMaybe<Scalars['Int']['input']>;
}>;


export type UpdateLeadSourceMutation = { __typename?: 'Mutation', updateLeadSource: { __typename?: 'LeadSource', id: string, uid: string, name: string, isActive?: number | null } };

export type DeleteLeadSourceMutationVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type DeleteLeadSourceMutation = { __typename?: 'Mutation', deleteLeadSource: boolean };

export type CreateCustomerMaintenanceMutationVariables = Exact<{
  customerUid: Scalars['String']['input'];
  callDate: Scalars['Date']['input'];
  category?: InputMaybe<Scalars['String']['input']>;
  takenCareByUid?: InputMaybe<Scalars['String']['input']>;
  method?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<Scalars['Int']['input']>;
  priority?: InputMaybe<Scalars['Int']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
}>;


export type CreateCustomerMaintenanceMutation = { __typename?: 'Mutation', createCustomerMaintenance: { __typename?: 'CustomerMaintenance', id: string, uid: string, customerUid: string, callDate: any, category?: string | null, takenCareByUid?: string | null, method?: number | null, status?: number | null, priority?: number | null, notes?: string | null, createdAt: any, createdByName?: string | null, takenCareByUser?: { __typename?: 'User', uid: string, name?: string | null } | null } };

export type UpdateCustomerMaintenanceMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  category?: InputMaybe<Scalars['String']['input']>;
  takenCareByUid?: InputMaybe<Scalars['String']['input']>;
  method?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<Scalars['Int']['input']>;
  priority?: InputMaybe<Scalars['Int']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
}>;


export type UpdateCustomerMaintenanceMutation = { __typename?: 'Mutation', updateCustomerMaintenance?: { __typename?: 'CustomerMaintenance', id: string, uid: string, category?: string | null, takenCareByUid?: string | null, method?: number | null, status?: number | null, priority?: number | null, notes?: string | null, updatedAt: any } | null };

export type DeleteCustomerMaintenanceMutationVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type DeleteCustomerMaintenanceMutation = { __typename?: 'Mutation', deleteCustomerMaintenance: boolean };

export type CreateItemCategoryMutationVariables = Exact<{
  name: Scalars['String']['input'];
  color?: InputMaybe<Scalars['String']['input']>;
}>;


export type CreateItemCategoryMutation = { __typename?: 'Mutation', createItemCategory: { __typename?: 'ItemCategory', id: string, uid: string, name: string, color?: string | null } };

export type UpdateItemCategoryMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  color?: InputMaybe<Scalars['String']['input']>;
  isActive?: InputMaybe<Scalars['Int']['input']>;
}>;


export type UpdateItemCategoryMutation = { __typename?: 'Mutation', updateItemCategory: { __typename?: 'ItemCategory', id: string, uid: string, name: string, color?: string | null, isActive?: number | null } };

export type DeleteItemCategoryMutationVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type DeleteItemCategoryMutation = { __typename?: 'Mutation', deleteItemCategory: boolean };

export type CreateCustomerNoteMutationVariables = Exact<{
  customerUid: Scalars['String']['input'];
  message: Scalars['String']['input'];
  followUp?: InputMaybe<Scalars['Date']['input']>;
  assignedTo?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
  maintenanceUid?: InputMaybe<Scalars['String']['input']>;
}>;


export type CreateCustomerNoteMutation = { __typename?: 'Mutation', createCustomerNote: { __typename?: 'CustomerNote', id: string, uid: string, customerUid: string, maintenanceUid?: string | null, message: string, followUp?: any | null, assignedTo?: string | null, type?: string | null, createdAt: any, createdBy?: string | null, createdByName?: string | null, assignedToUser?: { __typename?: 'User', uid: string, name?: string | null } | null, noteTypeDetails?: { __typename?: 'NoteType', uid: string, name: string, color?: string | null } | null } };

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


export type CreatePdfTermMutation = { __typename?: 'Mutation', createPdfTerm: { __typename?: 'PdfTerm', id: string, uid: string, name: string, rateType?: string | null, rateUids?: Array<string> | null, planUids?: Array<string> | null, message?: string | null } };

export type UpdatePdfTermMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  input: UpdatePdfTermInput;
}>;


export type UpdatePdfTermMutation = { __typename?: 'Mutation', updatePdfTerm: { __typename?: 'PdfTerm', id: string, uid: string, name: string, rateType?: string | null, rateUids?: Array<string> | null, planUids?: Array<string> | null, message?: string | null } };

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

export type CreatePlanMutationVariables = Exact<{
  input: CreatePlanInput;
}>;


export type CreatePlanMutation = { __typename?: 'Mutation', createPlan: { __typename?: 'Plan', uid: string, tenant: string, title: string, description?: string | null, discount?: number | null, propertyType?: number | null, isSolarRequired?: boolean | null, isBatteryRequired?: boolean | null, contractTerm?: string | null, exitFee?: number | null, isActive: boolean, createdAt?: any | null, updatedAt?: any | null, bonusUids?: Array<string> | null } };

export type UpdatePlanMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  input: UpdatePlanInput;
}>;


export type UpdatePlanMutation = { __typename?: 'Mutation', updatePlan: { __typename?: 'Plan', uid: string, tenant: string, title: string, description?: string | null, discount?: number | null, propertyType?: number | null, isSolarRequired?: boolean | null, isBatteryRequired?: boolean | null, contractTerm?: string | null, exitFee?: number | null, ratesJson?: string | null, isActive: boolean, createdAt?: any | null, updatedAt?: any | null, bonusUids?: Array<string> | null } };

export type DeletePlanMutationVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type DeletePlanMutation = { __typename?: 'Mutation', deletePlan: boolean };

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


export type CreateRoleMutation = { __typename?: 'Mutation', createRole: { __typename?: 'Role', uid: string, name: string, description?: string | null, isActive: boolean, isIndependentUi?: boolean | null, isVisibleInLists?: boolean | null, message?: string | null } };

export type UpdateRoleMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  input: UpdateRoleInput;
}>;


export type UpdateRoleMutation = { __typename?: 'Mutation', updateRole: { __typename?: 'Role', uid: string, name: string, description?: string | null, isActive: boolean, isIndependentUi?: boolean | null, isVisibleInLists?: boolean | null, message?: string | null } };

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


export type MeQuery = { __typename?: 'Query', me?: { __typename?: 'User', id: string, uid: string, email?: string | null, name?: string | null, number?: string | null, tenant: string, roleUid?: string | null, roleName?: string | null, status: UserStatus, isActive: boolean, isDeleted: boolean, createdAt: any, isIndependentUi?: boolean | null, isMaster?: number | null, branchTenant?: string | null, accessibleMenus?: Array<{ __typename?: 'AccessibleMenu', menuUid: string, menuName: string, menuCode: string, parentUid?: string | null, canView: boolean, canCreate: boolean, canEdit: boolean, canDelete: boolean, sortOrder?: number | null }> | null, accessibleFeatures?: Array<{ __typename?: 'AccessibleFeature', featureUid: string, featureCode: string, featureName: string, isEnabled: boolean }> | null } | null };

export type GetBatteryMakesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetBatteryMakesQuery = { __typename?: 'Query', batteryMakes: Array<{ __typename?: 'BatteryMake', uid: string, make: string, shortName?: string | null, description?: string | null, batteryUsableCapacity?: number | null, maxBackupLoad?: number | null, batteryProdWarranty?: string | null, productStatus?: number | null, cecStatus?: number | null, pdrsStatus?: number | null, cegCapacity?: number | null, batteryCapacityKwh?: number | null, cegExpiryDate?: any | null, declaredModelCount?: number | null, actualModelRows?: number | null, minCapacity?: number | null, maxCapacity?: number | null, isActive: boolean, datasheetPath?: string | null, datasheetUrl?: string | null, datasheetName?: string | null }> };

export type GetBatteryModelsQueryVariables = Exact<{
  makeUid: Scalars['String']['input'];
}>;


export type GetBatteryModelsQuery = { __typename?: 'Query', batteryModels: Array<{ __typename?: 'BatteryModel', uid: string, model: string, capacity?: number | null, bess2Eligible?: number | null, vpp1Eligible?: number | null, isActive: boolean }> };

export type GetActiveBonusesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetActiveBonusesQuery = { __typename?: 'Query', activeBonuses: Array<{ __typename?: 'Bonus', uid: string, name: string, description?: string | null, amount: number, contractTerm?: string | null, exitFee?: number | null }> };

export type GetAllBonusesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllBonusesQuery = { __typename?: 'Query', bonuses: Array<{ __typename?: 'Bonus', uid: string, name: string, description?: string | null, amount: number, isActive: boolean, contractTerm?: string | null, exitFee?: number | null, createdAt?: any | null, updatedAt?: any | null }> };

export type CreateBonusMutationVariables = Exact<{
  input: CreateBonusInput;
}>;


export type CreateBonusMutation = { __typename?: 'Mutation', createBonus: { __typename?: 'Bonus', uid: string, name: string, contractTerm?: string | null, exitFee?: number | null } };

export type UpdateBonusMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  input: UpdateBonusInput;
}>;


export type UpdateBonusMutation = { __typename?: 'Mutation', updateBonus: { __typename?: 'Bonus', uid: string, name: string, contractTerm?: string | null, exitFee?: number | null } };

export type DeleteBonusMutationVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type DeleteBonusMutation = { __typename?: 'Mutation', deleteBonus: boolean };

export type CustomersQueryVariables = Exact<{
  page?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type CustomersQuery = { __typename?: 'Query', customers: { __typename?: 'PaginatedCustomers', data: Array<{ __typename?: 'Customer', id: string, uid: string, customerId?: string | null, tenant: string, email?: string | null, title?: string | null, firstName?: string | null, lastName?: string | null, businessName?: string | null, legalName?: string | null, abn?: string | null, number?: string | null, dob?: any | null, phoneVerifiedAt?: any | null, propertyType?: number | null, tariffCode?: string | null, ratePlanUid?: string | null, planUid?: string | null, status?: number | null, utilmateStatus?: number | null, utilmateUpdatedAt?: any | null, utilmateUploadedManually?: number | null, gender?: number | null, relationshipStatus?: number | null, enquiryAmount?: number | null, checkCreditScore?: number | null, employerName?: string | null, riskStatus?: string | null, signDate?: any | null, signedPdfPath?: string | null, pdfAudit?: string | null, emailSent?: number | null, discount?: number | null, previousCustomerUid?: string | null, isActive: boolean, isDeleted: boolean, createdAt: any, offerEmailSentAt?: any | null, pdrsEmailSent?: number | null, pdrsEmailSentAt?: any | null, updatedAt: any, leadUid?: string | null, portalName?: string | null, selectedBonuses?: Array<string | null> | null, isConsentRead?: boolean | null, medicareIrn?: string | null, medicareCardType?: string | null, createdBy?: string | null, updatedBy?: string | null, deletedBy?: string | null, previousBill?: { __typename?: 'CustomerDocument', id: string, filename?: string | null, path?: string | null, size?: number | null, mimeType?: string | null, createdAt: any, createdBy?: string | null, createdByUser?: { __typename?: 'User', name?: string | null } | null } | null, identityProof?: { __typename?: 'CustomerDocument', id: string, filename?: string | null, path?: string | null, size?: number | null, mimeType?: string | null, createdAt: any, createdBy?: string | null, createdByUser?: { __typename?: 'User', name?: string | null } | null } | null, ratePlan?: { __typename?: 'RatePlan', id: string, uid: string, tenant: string, codes?: string | null, planId?: string | null, dnsp?: number | null, state?: string | null, tariff?: string | null, type?: number | null, vpp?: number | null, discountApplies?: number | null, discountPercentage?: number | null, isActive: boolean, isDeleted: boolean, createdAt: any, updatedAt: any, createdBy?: string | null, updatedBy?: string | null, deletedBy?: string | null, offers?: Array<{ __typename?: 'RateOffer', id: string, uid: string, ratePlanUid: string, tenant: string, offerName?: string | null, anytime?: number | null, cl1Supply?: number | null, cl1Usage?: number | null, cl2Supply?: number | null, cl2Usage?: number | null, demand?: number | null, demandOp?: number | null, demandP?: number | null, demandS?: number | null, fit?: number | null, fitPeak?: number | null, fitCritical?: number | null, fitVpp?: number | null, offPeak?: number | null, peak?: number | null, shoulder?: number | null, supplyCharge?: number | null, vppOrcharge?: number | null, dynamicRates?: Record<string, unknown> | null, priceUnits?: Record<string, unknown> | null, isActive: boolean, isDeleted: boolean, createdAt: any, updatedAt: any, createdBy?: string | null, updatedBy?: string | null, deletedBy?: string | null }> | null } | null, enrollmentDetails?: { __typename?: 'CustomerEnrollmentDetails', id: string, customerUid: string, saletype?: number | null, connectiondate?: any | null, idtype?: number | null, idnumber?: string | null, idstate?: string | null, idcountry?: string | null, idexpiry?: any | null, concession?: number | null, lifesupport?: number | null, billingpreference?: number | null, isActive: boolean, isDeleted: boolean, createdAt: any, updatedAt: any } | null, address?: { __typename?: 'CustomerAddress', id: string, customerUid: string, unitNumber?: string | null, flatOrUnitType?: string | null, gnafPid?: string | null, houseNumber?: string | null, buildingName?: string | null, floorLevelNumber?: string | null, streetNumber?: string | null, streetName?: string | null, streetType?: string | null, suburb?: string | null, state?: string | null, postcode?: string | null, country?: string | null, nmi?: string | null, isActive: boolean, isDeleted: boolean, createdAt: any, updatedAt: any } | null, solarDetails?: { __typename?: 'CustomerSolarSystem', id: string, customerUid: string, hassolar?: number | null, solarcapacity?: number | null, invertercapacity?: number | null, isActive: boolean, isDeleted: boolean, createdAt: any, updatedAt: any } | null, batteryDetails?: { __typename?: 'CustomerBatterySystem', id: string, customerUid: string, isbattery?: number | null, batterybrand?: string | null, snnumber?: string | null, batterycapacity?: number | null, exportlimit?: number | null, batterymodel?: string | null, inverterCapacity?: number | null, checkCode?: string | null, isActive: boolean, isDeleted: boolean, createdAt: any, updatedAt: any } | null, msatDetails?: { __typename?: 'CustomerMsat', id: string, customerUid: string, msatConnected?: number | null, msatConnectedAt?: any | null, msatUpdatedAt?: any | null, isActive: boolean, isDeleted: boolean, createdAt: any, updatedAt: any } | null, vppDetails?: { __typename?: 'CustomerVpp', id: string, customerUid: string, vpp?: number | null, vppConnected?: number | null, vppSignupBonus?: number | null, isActive: boolean, isDeleted: boolean, createdAt: any, updatedAt: any } | null, history?: { __typename?: 'CustomerHistory', id: string, version: number, customerSnapshot: string, createdAt: any } | null }>, meta: { __typename?: 'PaginationMeta', totalRecords: number, currentPage: number, totalPages: number, recordsPerPage: number } } };

export type CustomersListQueryVariables = Exact<{
  page?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type CustomersListQuery = { __typename?: 'Query', customers: { __typename?: 'PaginatedCustomers', data: Array<{ __typename?: 'Customer', id: string, uid: string, customerId?: string | null, tenant: string, email?: string | null, title?: string | null, firstName?: string | null, lastName?: string | null, businessName?: string | null, legalName?: string | null, abn?: string | null, number?: string | null, dob?: any | null, phoneVerifiedAt?: any | null, propertyType?: number | null, tariffCode?: string | null, status?: number | null, utilmateStatus?: number | null, utilmateUpdatedAt?: any | null, utilmateUploadedManually?: number | null, gender?: number | null, relationshipStatus?: number | null, enquiryAmount?: number | null, checkCreditScore?: number | null, employerName?: string | null, riskStatus?: string | null, signDate?: any | null, signedPdfPath?: string | null, pdfAudit?: string | null, emailSent?: number | null, discount?: number | null, previousCustomerUid?: string | null, isActive: boolean, isDeleted: boolean, leadUid?: string | null, portalName?: string | null, isConsentRead?: boolean | null, medicareIrn?: string | null, medicareCardType?: string | null, createdBy?: string | null, updatedBy?: string | null, deletedBy?: string | null, previousBill?: { __typename?: 'CustomerDocument', id: string, filename?: string | null, path?: string | null, size?: number | null, mimeType?: string | null, createdAt: any, createdBy?: string | null, createdByUser?: { __typename?: 'User', name?: string | null } | null } | null, identityProof?: { __typename?: 'CustomerDocument', id: string, filename?: string | null, path?: string | null, size?: number | null, mimeType?: string | null, createdAt: any, createdBy?: string | null, createdByUser?: { __typename?: 'User', name?: string | null } | null } | null, ratePlan?: { __typename?: 'RatePlan', id: string, uid: string, tenant: string, codes?: string | null, planId?: string | null, dnsp?: number | null, state?: string | null, tariff?: string | null, type?: number | null, vpp?: number | null, discountApplies?: number | null, discountPercentage?: number | null, isActive: boolean, isDeleted: boolean, createdAt: any, updatedAt: any, createdBy?: string | null, updatedBy?: string | null, deletedBy?: string | null } | null, address?: { __typename?: 'CustomerAddress', id: string, customerUid: string, unitNumber?: string | null, flatOrUnitType?: string | null, gnafPid?: string | null, houseNumber?: string | null, buildingName?: string | null, floorLevelNumber?: string | null, streetNumber?: string | null, streetName?: string | null, streetType?: string | null, suburb?: string | null, state?: string | null, postcode?: string | null, country?: string | null, nmi?: string | null, isActive: boolean, isDeleted: boolean, createdAt: any, updatedAt: any } | null, solarDetails?: { __typename?: 'CustomerSolarSystem', id: string, customerUid: string, hassolar?: number | null, solarcapacity?: number | null, invertercapacity?: number | null, isActive: boolean, isDeleted: boolean, createdAt: any, updatedAt: any } | null, vppDetails?: { __typename?: 'CustomerVpp', id: string, customerUid: string, vpp?: number | null, vppConnected?: number | null, vppSignupBonus?: number | null, isActive: boolean, isDeleted: boolean, createdAt: any, updatedAt: any } | null }>, meta: { __typename?: 'PaginationMeta', totalRecords: number, currentPage: number, totalPages: number, recordsPerPage: number } } };

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
  searchAssignedTo?: InputMaybe<Scalars['String']['input']>;
  searchPortal?: InputMaybe<Scalars['String']['input']>;
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
  searchVppApiPushed?: InputMaybe<Scalars['Int']['input']>;
  searchUtilmateStatus?: InputMaybe<Scalars['Int']['input']>;
  searchUtilmateApiPushed?: InputMaybe<Scalars['Int']['input']>;
  searchMsatConnected?: InputMaybe<Scalars['Int']['input']>;
  searchAssignedTo?: InputMaybe<Scalars['String']['input']>;
  searchPortal?: InputMaybe<Scalars['String']['input']>;
  searchSigned?: InputMaybe<Scalars['Int']['input']>;
  includeDeleted?: InputMaybe<Scalars['String']['input']>;
}>;


export type CustomersCursorQuery = { __typename?: 'Query', customersCursor: { __typename?: 'CursorPaginatedCustomers', data: Array<{ __typename?: 'Customer', id: string, uid: string, customerId?: string | null, tenant: string, title?: string | null, firstName?: string | null, lastName?: string | null, legalName?: string | null, number?: string | null, propertyType?: number | null, tariffCode?: string | null, status?: number | null, utilmateStatus?: number | null, utilmateUpdatedAt?: any | null, utilmateUploadedManually?: number | null, riskStatus?: string | null, leadUid?: string | null, portalName?: string | null, source?: string | null, referralName?: string | null, discount?: number | null, pdrsEmailSent?: number | null, pdrsEmailSentAt?: any | null, isWithoutSignature?: number | null, assignedToUid?: string | null, isDeleted: boolean, createdBy?: string | null, referenceId?: string | null, msatDetails?: { __typename?: 'CustomerMsat', msatConnected?: number | null, msatUpdatedAt?: any | null } | null, ratePlan?: { __typename?: 'RatePlan', id: string, uid: string, dnsp?: number | null } | null, vppDetails?: { __typename?: 'CustomerVpp', vpp?: number | null, vppConnected?: number | null, vppSignupBonus?: number | null, vppApiPushed?: number | null, updatedAt: any } | null, batteryDetails?: { __typename?: 'CustomerBatterySystem', isbattery?: number | null, batterybrand?: string | null, snnumber?: string | null, batterycapacity?: number | null, exportlimit?: number | null, batterymodel?: string | null, inverterCapacity?: number | null } | null, utilmateDetails?: { __typename?: 'CustomerUtilmate', utilmateConnected?: number | null, siteIdentifier?: string | null, accountNumber?: string | null, utilmateConnectedAt?: any | null, utilmateApiPushed?: number | null } | null, address?: { __typename?: 'CustomerAddress', fullAddress?: string | null, nmi?: string | null } | null, assignedToUser?: { __typename?: 'User', uid: string, name?: string | null, email?: string | null } | null, createdByUser?: { __typename?: 'User', uid: string, name?: string | null } | null }>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null, endCursor?: string | null, totalCount?: number | null } } };

export type GetCustomerByIdQueryVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type GetCustomerByIdQuery = { __typename?: 'Query', customer?: { __typename?: 'Customer', uid: string, assignedToUid?: string | null, selectedBonuses?: Array<string | null> | null, isConsentRead?: boolean | null, medicareIrn?: string | null, medicareCardType?: string | null, customerId?: string | null, email?: string | null, title?: string | null, firstName?: string | null, lastName?: string | null, businessName?: string | null, legalName?: string | null, abn?: string | null, showAsBusinessName?: boolean | null, showName?: boolean | null, number?: string | null, phoneVerifiedAt?: any | null, dob?: any | null, propertyType?: number | null, tariffCode?: string | null, ratePlanUid?: string | null, planUid?: string | null, status?: number | null, discount?: number | null, signDate?: any | null, signedPdfPath?: string | null, emailSent?: number | null, utilmateStatus?: number | null, rateVersion?: string | null, gender?: number | null, relationshipStatus?: number | null, enquiryAmount?: number | null, checkCreditScore?: number | null, employerName?: string | null, creditScore?: number | null, isCreditScoreFetched?: number | null, isWithoutSignature?: number | null, riskStatus?: string | null, emailLogCount?: number | null, offerVersion?: number | null, viewCode?: string | null, isActive: boolean, isDeleted: boolean, createdAt: any, offerEmailSentAt?: any | null, updatedAt: any, portalName?: string | null, source?: string | null, referralName?: string | null, pdrsEmailSent?: number | null, pdrsEmailSentAt?: any | null, assignedToUser?: { __typename?: 'User', uid: string, name?: string | null, email?: string | null } | null, plan?: { __typename?: 'Plan', uid: string, ratesJson?: string | null, discount?: number | null } | null, address?: { __typename?: 'CustomerAddress', id: string, customerUid: string, unitNumber?: string | null, flatOrUnitType?: string | null, gnafPid?: string | null, houseNumber?: string | null, buildingName?: string | null, floorLevelNumber?: string | null, streetNumber?: string | null, streetName?: string | null, streetType?: string | null, suburb?: string | null, state?: string | null, postcode?: string | null, country?: string | null, nmi?: string | null, fullAddress?: string | null } | null, ratePlan?: { __typename?: 'RatePlan', uid: string, codes?: string | null, planId?: string | null, dnsp?: number | null, tariff?: string | null, state?: string | null, type?: number | null, vpp?: number | null, discountApplies?: number | null, discountPercentage?: number | null, offers?: Array<{ __typename?: 'RateOffer', uid: string, offerName?: string | null, anytime?: number | null, cl1Supply?: number | null, cl1Usage?: number | null, cl2Supply?: number | null, cl2Usage?: number | null, demand?: number | null, demandOp?: number | null, demandP?: number | null, demandS?: number | null, fit?: number | null, fitPeak?: number | null, fitCritical?: number | null, fitVpp?: number | null, offPeak?: number | null, peak?: number | null, shoulder?: number | null, supplyCharge?: number | null, vppOrcharge?: number | null, dynamicRates?: Record<string, unknown> | null, priceUnits?: Record<string, unknown> | null }> | null } | null, vppDetails?: { __typename?: 'CustomerVpp', vpp?: number | null, vppConnected?: number | null, vppSignupBonus?: number | null } | null, solarDetails?: { __typename?: 'CustomerSolarSystem', hassolar?: number | null, solarcapacity?: number | null, invertercapacity?: number | null } | null, batteryDetails?: { __typename?: 'CustomerBatterySystem', isbattery?: number | null, batterybrand?: string | null, snnumber?: string | null, batterycapacity?: number | null, exportlimit?: number | null, batterymodel?: string | null, inverterCapacity?: number | null } | null, enrollmentDetails?: { __typename?: 'CustomerEnrollmentDetails', saletype?: number | null, connectiondate?: any | null, idtype?: number | null, idnumber?: string | null, idstate?: string | null, idcountry?: string | null, idexpiry?: any | null, concession?: number | null, lifesupport?: number | null, billingpreference?: number | null, licenseNumber?: string | null, licenseState?: string | null, licenseExpiry?: any | null, licenseCardNumber?: string | null, medicareCardType?: string | null, medicareIrn?: string | null } | null, debitDetails?: { __typename?: 'CustomerDebitDetails', optIn?: number | null, accountType?: number | null, firstName?: string | null, lastName?: string | null, bankName?: string | null, bankAddress?: string | null, bsb?: string | null, accountNumber?: string | null, paymentFrequency?: number | null, firstDebitDate?: any | null } | null, utilmateDetails?: { __typename?: 'CustomerUtilmate', utilmateConnected?: number | null } | null, previousBill?: { __typename?: 'CustomerDocument', id: string, filename?: string | null, path?: string | null } | null, identityProof?: { __typename?: 'CustomerDocument', id: string, filename?: string | null, path?: string | null } | null, licenseDocument?: { __typename?: 'CustomerDocument', id: string, filename?: string | null, path?: string | null } | null, msatDetails?: { __typename?: 'CustomerMsat', msatConnected?: number | null, msatConnectedAt?: any | null, msatUpdatedAt?: any | null } | null, vppCertificateDetails?: { __typename?: 'CustomerVppCertificateDetails', id: string, certificateNo?: string | null, isAllRequiredFilled?: number | null, isVppCertificateEmailSent?: number | null } | null } | null };

export type GetCustomerGeneralDetailsQueryVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type GetCustomerGeneralDetailsQuery = { __typename?: 'Query', customer?: { __typename?: 'Customer', uid: string, isConsentRead?: boolean | null, medicareIrn?: string | null, medicareCardType?: string | null, customerId?: string | null, email?: string | null, title?: string | null, firstName?: string | null, lastName?: string | null, businessName?: string | null, legalName?: string | null, abn?: string | null, showAsBusinessName?: boolean | null, showName?: boolean | null, number?: string | null, phoneVerifiedAt?: any | null, dob?: any | null, propertyType?: number | null, tariffCode?: string | null, ratePlanUid?: string | null, planUid?: string | null, status?: number | null, discount?: number | null, signDate?: any | null, signedPdfPath?: string | null, emailSent?: number | null, utilmateStatus?: number | null, rateVersion?: string | null, gender?: number | null, relationshipStatus?: number | null, enquiryAmount?: number | null, checkCreditScore?: number | null, employerName?: string | null, creditScore?: number | null, isCreditScoreFetched?: number | null, isWithoutSignature?: number | null, riskStatus?: string | null, emailLogCount?: number | null, offerVersion?: number | null, viewCode?: string | null, isActive: boolean, isDeleted: boolean, createdAt: any, offerEmailSentAt?: any | null, pdrsEmailSent?: number | null, pdrsEmailSentAt?: any | null, updatedAt: any, portalName?: string | null, source?: string | null, referralName?: string | null, plan?: { __typename?: 'Plan', uid: string, ratesJson?: string | null, discount?: number | null } | null, address?: { __typename?: 'CustomerAddress', id: string, customerUid: string, unitNumber?: string | null, flatOrUnitType?: string | null, gnafPid?: string | null, houseNumber?: string | null, buildingName?: string | null, floorLevelNumber?: string | null, streetNumber?: string | null, streetName?: string | null, streetType?: string | null, suburb?: string | null, state?: string | null, postcode?: string | null, country?: string | null, nmi?: string | null, fullAddress?: string | null } | null, ratePlan?: { __typename?: 'RatePlan', uid: string, codes?: string | null, planId?: string | null, dnsp?: number | null, tariff?: string | null, state?: string | null, type?: number | null, vpp?: number | null, discountApplies?: number | null, discountPercentage?: number | null, offers?: Array<{ __typename?: 'RateOffer', uid: string, offerName?: string | null, anytime?: number | null, cl1Supply?: number | null, cl1Usage?: number | null, cl2Supply?: number | null, cl2Usage?: number | null, demand?: number | null, demandOp?: number | null, demandP?: number | null, demandS?: number | null, fit?: number | null, fitPeak?: number | null, fitCritical?: number | null, fitVpp?: number | null, offPeak?: number | null, peak?: number | null, shoulder?: number | null, supplyCharge?: number | null, vppOrcharge?: number | null, dynamicRates?: Record<string, unknown> | null, priceUnits?: Record<string, unknown> | null }> | null } | null, vppDetails?: { __typename?: 'CustomerVpp', vpp?: number | null, vppConnected?: number | null, vppSignupBonus?: number | null } | null, solarDetails?: { __typename?: 'CustomerSolarSystem', hassolar?: number | null, solarcapacity?: number | null, invertercapacity?: number | null } | null, batteryDetails?: { __typename?: 'CustomerBatterySystem', batterybrand?: string | null, snnumber?: string | null, batterycapacity?: number | null, exportlimit?: number | null, batterymodel?: string | null, inverterCapacity?: number | null } | null, enrollmentDetails?: { __typename?: 'CustomerEnrollmentDetails', saletype?: number | null, connectiondate?: any | null, idtype?: number | null, idnumber?: string | null, idstate?: string | null, idcountry?: string | null, idexpiry?: any | null, concession?: number | null, lifesupport?: number | null, billingpreference?: number | null, licenseNumber?: string | null, licenseState?: string | null, licenseExpiry?: any | null, licenseCardNumber?: string | null, medicareCardType?: string | null, medicareIrn?: string | null } | null, debitDetails?: { __typename?: 'CustomerDebitDetails', optIn?: number | null, accountType?: number | null, firstName?: string | null, lastName?: string | null, bankName?: string | null, bankAddress?: string | null, bsb?: string | null, accountNumber?: string | null, paymentFrequency?: number | null, firstDebitDate?: any | null } | null, utilmateDetails?: { __typename?: 'CustomerUtilmate', utilmateConnected?: number | null } | null, previousBill?: { __typename?: 'CustomerDocument', id: string, uid: string, customerUid: string, filename?: string | null, path?: string | null, size?: number | null, mimeType?: string | null, createdAt: any, updatedAt: any, createdBy?: string | null, documentType?: { __typename?: 'DocumentType', uid: string, name: string, color?: string | null, category?: string | null } | null, createdByUser?: { __typename?: 'User', uid: string, name?: string | null } | null } | null, identityProof?: { __typename?: 'CustomerDocument', id: string, uid: string, customerUid: string, filename?: string | null, path?: string | null, size?: number | null, mimeType?: string | null, createdAt: any, updatedAt: any, createdBy?: string | null, documentType?: { __typename?: 'DocumentType', uid: string, name: string, color?: string | null, category?: string | null } | null, createdByUser?: { __typename?: 'User', uid: string, name?: string | null } | null } | null, licenseDocument?: { __typename?: 'CustomerDocument', id: string, uid: string, customerUid: string, filename?: string | null, path?: string | null, size?: number | null, mimeType?: string | null, createdAt: any, updatedAt: any, createdBy?: string | null, documentType?: { __typename?: 'DocumentType', uid: string, name: string, color?: string | null, category?: string | null } | null, createdByUser?: { __typename?: 'User', uid: string, name?: string | null } | null } | null, documents?: Array<{ __typename?: 'CustomerDocument', id: string, uid: string, customerUid: string, type?: string | null, name?: string | null, filename?: string | null, path?: string | null, size?: number | null, mimeType?: string | null, startDate?: any | null, endDate?: any | null, createdAt: any, createdBy?: string | null, documentType?: { __typename?: 'DocumentType', uid: string, name: string, color?: string | null, category?: string | null } | null, createdByUser?: { __typename?: 'User', uid: string, name?: string | null } | null } | null> | null, vppCertificateDetails?: { __typename?: 'CustomerVppCertificateDetails', isAllRequiredFilled?: number | null, isVppCertificateEmailSent?: number | null, isVppCertificateEmailSentAt?: any | null, batteryManufacturer?: string | null, batterySerialNumber?: string | null, batteryUsableCapacity?: number | null, inverterManufacturer?: string | null, inverterSnNumbers?: string | null, inverterCapacity?: number | null, id: string, certificateNo?: string | null } | null, msatDetails?: { __typename?: 'CustomerMsat', msatConnected?: number | null, msatConnectedAt?: any | null, msatUpdatedAt?: any | null } | null } | null };

export type GetCustomerSolarVppDetailsQueryVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type GetCustomerSolarVppDetailsQuery = { __typename?: 'Query', customer?: { __typename?: 'Customer', uid: string, vppDetails?: { __typename?: 'CustomerVpp', id: string, customerUid: string, vpp?: number | null, vppConnected?: number | null, vppSignupBonus?: number | null } | null, solarDetails?: { __typename?: 'CustomerSolarSystem', id: string, customerUid: string, hassolar?: number | null, solarcapacity?: number | null, invertercapacity?: number | null } | null, batteryDetails?: { __typename?: 'CustomerBatterySystem', id: string, customerUid: string, isbattery?: number | null, batterybrand?: string | null, snnumber?: string | null, batterycapacity?: number | null, exportlimit?: number | null, batterymodel?: string | null, inverterCapacity?: number | null, checkCode?: string | null, isActive: boolean, isDeleted: boolean, createdAt: any, updatedAt: any } | null, vppCertificateDetails?: { __typename?: 'CustomerVppCertificateDetails', batteryManufacturer?: string | null, batterySerialNumber?: string | null, batteryUsableCapacity?: number | null, inverterManufacturer?: string | null, inverterSnNumbers?: string | null, inverterCapacity?: number | null } | null } | null };

export type GetCustomerVppCertificateDetailsQueryVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type GetCustomerVppCertificateDetailsQuery = { __typename?: 'Query', customer?: { __typename?: 'Customer', uid: string, vppCertificateDetails?: { __typename?: 'CustomerVppCertificateDetails', id: string, certificateNo?: string | null, issueDate?: any | null, batteryManufacturer?: string | null, batteryModel?: string | null, batterySerialNumber?: string | null, batteryInstalledDate?: any | null, batteryUsableCapacity?: number | null, batteryPortConnected?: number | null, inverterManufacturer?: string | null, inverterModel?: string | null, inverterSnNumbers?: string | null, inverterCapacity?: number | null, isLifeSupportEquipment?: number | null, ifYesDetails?: string | null, internetConnectionType?: number | null, internetOtherText?: string | null, modemRouterLocation?: string | null, apiIntegration?: number | null, remoteChargesCommandTest?: number | null, remoteChargesCommandTestAt?: any | null, remoteDischargesCommandTest?: number | null, remoteDischargesCommandTestAt?: any | null, stateOfChangeMonitoring?: number | null, stateOfChangeMonitoringAt?: any | null, gridExportVerification?: number | null, gridExportVerificationAt?: any | null, gridImportVerification?: number | null, gridImportVerificationAt?: any | null, communicationFailSafeTest?: number | null, communicationFailSafeTestAt?: any | null, testResult?: string | null, additionalNotes?: string | null, isAllRequiredFilled?: number | null, isVppCertificateEmailSent?: number | null, isVppCertificateEmailSentAt?: any | null } | null, batteryDetails?: { __typename?: 'CustomerBatterySystem', batterybrand?: string | null, snnumber?: string | null, batterycapacity?: number | null, batterymodel?: string | null, inverterCapacity?: number | null } | null } | null };

export type GetCustomerDebitDetailsQueryVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type GetCustomerDebitDetailsQuery = { __typename?: 'Query', customer?: { __typename?: 'Customer', uid: string, debitDetails?: { __typename?: 'CustomerDebitDetails', id: string, customerUid: string, accountType?: number | null, companyName?: string | null, abn?: string | null, firstName?: string | null, lastName?: string | null, bankName?: string | null, bankAddress?: string | null, bsb?: string | null, accountNumber?: string | null, paymentFrequency?: number | null, firstDebitDate?: any | null, optIn?: number | null } | null } | null };

export type GetCustomerUtilmateDetailsQueryVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type GetCustomerUtilmateDetailsQuery = { __typename?: 'Query', customer?: { __typename?: 'Customer', uid: string, utilmateDetails?: { __typename?: 'CustomerUtilmate', id: string, customerUid: string, siteIdentifier?: string | null, accountNumber?: string | null, utilmateConnected?: number | null, utilmateConnectedAt?: any | null, utilmateApiPushed?: number | null } | null, msatDetails?: { __typename?: 'CustomerMsat', id: string, customerUid: string, msatConnected?: number | null, msatConnectedAt?: any | null, msatUpdatedAt?: any | null } | null } | null };

export type GetCustomerDocumentsQueryVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type GetCustomerDocumentsQuery = { __typename?: 'Query', customer?: { __typename?: 'Customer', uid: string, previousBill?: { __typename?: 'CustomerDocument', id: string, uid: string, customerUid: string, filename?: string | null, path?: string | null, size?: number | null, mimeType?: string | null, createdAt: any, updatedAt: any, createdBy?: string | null, documentType?: { __typename?: 'DocumentType', uid: string, name: string, color?: string | null, category?: string | null } | null, createdByUser?: { __typename?: 'User', uid: string, name?: string | null } | null } | null, identityProof?: { __typename?: 'CustomerDocument', id: string, uid: string, customerUid: string, filename?: string | null, path?: string | null, size?: number | null, mimeType?: string | null, createdAt: any, updatedAt: any, createdBy?: string | null, documentType?: { __typename?: 'DocumentType', uid: string, name: string, color?: string | null, category?: string | null } | null, createdByUser?: { __typename?: 'User', uid: string, name?: string | null } | null } | null, licenseDocument?: { __typename?: 'CustomerDocument', id: string, uid: string, customerUid: string, filename?: string | null, path?: string | null, size?: number | null, mimeType?: string | null, createdAt: any, updatedAt: any, createdBy?: string | null, documentType?: { __typename?: 'DocumentType', uid: string, name: string, color?: string | null, category?: string | null } | null, createdByUser?: { __typename?: 'User', uid: string, name?: string | null } | null } | null, documents?: Array<{ __typename?: 'CustomerDocument', id: string, uid: string, customerUid: string, type?: string | null, name?: string | null, filename?: string | null, path?: string | null, size?: number | null, mimeType?: string | null, startDate?: any | null, endDate?: any | null, createdAt: any, createdBy?: string | null, documentType?: { __typename?: 'DocumentType', uid: string, name: string, color?: string | null, category?: string | null } | null, createdByUser?: { __typename?: 'User', uid: string, name?: string | null } | null } | null> | null, vppCertificateDetails?: { __typename?: 'CustomerVppCertificateDetails', id: string, certificateNo?: string | null, isAllRequiredFilled?: number | null, isVppCertificateEmailSent?: number | null } | null } | null };

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


export type GetCustomerByCustomerIdQuery = { __typename?: 'Query', customerByCustomerId?: { __typename?: 'Customer', uid: string, selectedBonuses?: Array<string | null> | null, customerId?: string | null, portalName?: string | null, email?: string | null, firstName?: string | null, lastName?: string | null, businessName?: string | null, abn?: string | null, showAsBusinessName?: boolean | null, showName?: boolean | null, number?: string | null, dob?: any | null, propertyType?: number | null, tariffCode?: string | null, ratePlanUid?: string | null, planUid?: string | null, status?: number | null, discount?: number | null, signDate?: any | null, emailSent?: number | null, offerEmailSentAt?: any | null, utilmateStatus?: number | null, viewCode?: string | null, isActive: boolean, isDeleted: boolean, createdAt: any, phoneVerifiedAt?: any | null, updatedAt: any, rateVersion?: string | null, offerVersion?: number | null, ratePlan?: { __typename?: 'RatePlan', uid: string, codes?: string | null, planId?: string | null, dnsp?: number | null, state?: string | null, tariff?: string | null, type?: number | null, vpp?: number | null, offers?: Array<{ __typename?: 'RateOffer', uid: string, offerName?: string | null, anytime?: number | null, cl1Supply?: number | null, cl1Usage?: number | null, cl2Supply?: number | null, cl2Usage?: number | null, demand?: number | null, demandOp?: number | null, demandP?: number | null, demandS?: number | null, fit?: number | null, fitPeak?: number | null, fitCritical?: number | null, fitVpp?: number | null, offPeak?: number | null, peak?: number | null, shoulder?: number | null, supplyCharge?: number | null, vppOrcharge?: number | null, dynamicRates?: Record<string, unknown> | null, priceUnits?: Record<string, unknown> | null }> | null } | null, plan?: { __typename?: 'Plan', uid: string, ratesJson?: string | null, discount?: number | null, title: string, bonusUids?: Array<string> | null } | null, address?: { __typename?: 'CustomerAddress', id: string, customerUid: string, unitNumber?: string | null, flatOrUnitType?: string | null, gnafPid?: string | null, houseNumber?: string | null, buildingName?: string | null, floorLevelNumber?: string | null, streetNumber?: string | null, streetName?: string | null, streetType?: string | null, suburb?: string | null, state?: string | null, postcode?: string | null, country?: string | null, nmi?: string | null, fullAddress?: string | null } | null, msatDetails?: { __typename?: 'CustomerMsat', id: string, customerUid: string, msatConnected?: number | null, msatConnectedAt?: any | null, msatUpdatedAt?: any | null } | null, vppDetails?: { __typename?: 'CustomerVpp', id: string, customerUid: string, vpp?: number | null, vppConnected?: number | null, vppSignupBonus?: number | null } | null, solarDetails?: { __typename?: 'CustomerSolarSystem', id: string, customerUid: string, hassolar?: number | null, solarcapacity?: number | null, invertercapacity?: number | null } | null, batteryDetails?: { __typename?: 'CustomerBatterySystem', id: string, customerUid: string, isbattery?: number | null, batterybrand?: string | null, snnumber?: string | null, batterycapacity?: number | null, exportlimit?: number | null, batterymodel?: string | null, inverterCapacity?: number | null, checkCode?: string | null, isActive: boolean, isDeleted: boolean, createdAt: any, updatedAt: any } | null, debitDetails?: { __typename?: 'CustomerDebitDetails', id: string, customerUid: string, accountType?: number | null, companyName?: string | null, abn?: string | null, firstName?: string | null, lastName?: string | null, bankName?: string | null, bankAddress?: string | null, bsb?: string | null, accountNumber?: string | null, paymentFrequency?: number | null, firstDebitDate?: any | null, optIn?: number | null } | null, enrollmentDetails?: { __typename?: 'CustomerEnrollmentDetails', id: string, customerUid: string, saletype?: number | null, connectiondate?: any | null, idtype?: number | null, idnumber?: string | null, idstate?: string | null, idcountry?: string | null, idexpiry?: any | null, concession?: number | null, lifesupport?: number | null, billingpreference?: number | null } | null, documents?: Array<{ __typename?: 'CustomerDocument', id: string, uid: string, customerUid: string, type?: string | null, name?: string | null, filename?: string | null, path?: string | null, size?: number | null, mimeType?: string | null, createdAt: any, createdBy?: string | null, createdByUser?: { __typename?: 'User', uid: string, name?: string | null } | null } | null> | null, vppCertificateDetails?: { __typename?: 'CustomerVppCertificateDetails', id: string, certificateNo?: string | null, isAllRequiredFilled?: number | null, isVppCertificateEmailSent?: number | null } | null } | null };

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

export type GetNextCustomerIdQueryVariables = Exact<{ [key: string]: never; }>;


export type GetNextCustomerIdQuery = { __typename?: 'Query', getNextCustomerId: string };

export type GetWebEnrollmentsQueryVariables = Exact<{
  page?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  processed?: InputMaybe<Scalars['Int']['input']>;
  searchName?: InputMaybe<Scalars['String']['input']>;
  searchEmail?: InputMaybe<Scalars['String']['input']>;
  searchMobile?: InputMaybe<Scalars['String']['input']>;
  searchNmi?: InputMaybe<Scalars['String']['input']>;
  searchTariff?: InputMaybe<Scalars['String']['input']>;
  searchAddress?: InputMaybe<Scalars['String']['input']>;
  searchPortal?: InputMaybe<Scalars['String']['input']>;
  searchVpp?: InputMaybe<Scalars['Int']['input']>;
  branchTenant?: InputMaybe<Scalars['String']['input']>;
  searchCompanyName?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetWebEnrollmentsQuery = { __typename?: 'Query', webEnrollments: { __typename?: 'PaginatedWebEnrollments', data: Array<{ __typename?: 'WebEnrollment', id: string, uid: string, payload: Record<string, unknown>, processed: number, isConsentRead?: number | null, medicareIrn?: string | null, medicareCardType?: string | null, isEnrollmentFinished?: number | null, createdAt: any }>, meta: { __typename?: 'PaginationMeta', totalRecords: number, currentPage: number, totalPages: number, recordsPerPage: number } } };

export type GetPeerlessCompanyNamesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetPeerlessCompanyNamesQuery = { __typename?: 'Query', peerlessCompanyNames: Array<string> };

export type GetWebEnrollmentByUidQueryVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type GetWebEnrollmentByUidQuery = { __typename?: 'Query', webEnrollmentByUid?: { __typename?: 'WebEnrollment', uid: string, payload: Record<string, unknown>, isConsentRead?: number | null, medicareIrn?: string | null, medicareCardType?: string | null, isEnrollmentFinished?: number | null, createdAt: any } | null };

export type GetCustomerDashboardQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCustomerDashboardQuery = { __typename?: 'Query', customerDashboard: { __typename?: 'CustomerDashboardSummary', utilmateStatusSummary: { __typename?: 'SummaryCategory', count: number, customers: Array<{ __typename?: 'CustomerSummaryItem', uid: string, customerId?: string | null, firstName?: string | null, lastName?: string | null, email?: string | null, status?: number | null, utilmateStatus?: number | null, vppConnected?: number | null, vpp?: number | null }> }, signedStatusSummary: { __typename?: 'SummaryCategory', count: number, customers: Array<{ __typename?: 'CustomerSummaryItem', uid: string, customerId?: string | null, firstName?: string | null, lastName?: string | null, email?: string | null, status?: number | null }> }, vppPendingSummary: { __typename?: 'SummaryCategory', count: number, customers: Array<{ __typename?: 'CustomerSummaryItem', uid: string, customerId?: string | null, firstName?: string | null, lastName?: string | null, email?: string | null, status?: number | null, vppConnected?: number | null }> } } };

export type GetMonthlyEnrollmentsQueryVariables = Exact<{
  months?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetMonthlyEnrollmentsQuery = { __typename?: 'Query', monthlyEnrollments: Array<{ __typename?: 'MonthlyEnrollment', month: string, year: number, count: number }> };

export type GetLeadSourceDistributionQueryVariables = Exact<{ [key: string]: never; }>;


export type GetLeadSourceDistributionQuery = { __typename?: 'Query', leadSourceDistribution: Array<{ __typename?: 'LeadSourceDistribution', source: string, count: number, percentage: number }> };

export type GetAllEmailLogsQueryVariables = Exact<{
  page?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['Int']['input']>;
  emailType?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetAllEmailLogsQuery = { __typename?: 'Query', allEmailLogs: { __typename?: 'PaginatedEmailLogs', meta: { __typename?: 'PaginationMeta', totalRecords: number, currentPage: number, totalPages: number, recordsPerPage: number }, data: Array<{ __typename?: 'CustomerEmailLog', id: string, customerUid: string, customerId?: string | null, emailTo?: string | null, emailType?: string | null, subject?: string | null, body?: string | null, status: number, errorMessage?: string | null, sentAt?: any | null, verifiedAt?: any | null, createdAt: any, createdBy?: string | null, tenant?: string | null, verificationCode?: string | null, attachments?: Array<string | null> | null }> } };

export type GetCustomerEmailLogsQueryVariables = Exact<{
  customerUid: Scalars['String']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetCustomerEmailLogsQuery = { __typename?: 'Query', customerEmailLogs: { __typename?: 'PaginatedEmailLogs', meta: { __typename?: 'PaginationMeta', totalRecords: number, currentPage: number, totalPages: number, recordsPerPage: number }, data: Array<{ __typename?: 'CustomerEmailLog', id: string, customerUid: string, customerId?: string | null, emailTo?: string | null, emailType?: string | null, subject?: string | null, body?: string | null, status: number, errorMessage?: string | null, sentAt?: any | null, verifiedAt?: any | null, createdAt: any, createdBy?: string | null, tenant?: string | null, verificationCode?: string | null, attachments?: Array<string | null> | null }> } };

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


export type GetEmailTemplatesQuery = { __typename?: 'Query', emailTemplates: { __typename?: 'PaginatedEmailTemplates', data: Array<{ __typename?: 'EmailTemplate', id: string, uid: string, name: string, subject: string, entityType?: number | null, announcementUid?: string | null, status: number, isActive: boolean, isDeleted: boolean, createdAt: any, updatedAt: any }>, meta: { __typename?: 'PaginationMeta', totalRecords: number, currentPage: number, totalPages: number, recordsPerPage: number } } };

export type GetEmailTemplateQueryVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type GetEmailTemplateQuery = { __typename?: 'Query', emailTemplate?: { __typename?: 'EmailTemplate', id: string, uid: string, name: string, entityType?: number | null, subject: string, body?: string | null, announcementUid?: string | null, status: number, isActive: boolean, isDeleted: boolean, createdAt: any, updatedAt: any } | null };

export type PreviewSystemTemplateQueryVariables = Exact<{
  eventType: Scalars['String']['input'];
  isWithoutSignature?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type PreviewSystemTemplateQuery = { __typename?: 'Query', previewSystemTemplate: { __typename?: 'SystemTemplatePreview', subject: string, body: string, isCustom: boolean } };

export type GetAnnouncementsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAnnouncementsQuery = { __typename?: 'Query', announcements: Array<{ __typename?: 'Announcement', id: string, uid: string, name: string, fileName: string, isActive: boolean, createdAt: any }> };

export type GetInverterMakesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetInverterMakesQuery = { __typename?: 'Query', inverterMakes: Array<{ __typename?: 'InverterMake', uid: string, make: string, shortName?: string | null, description?: string | null, minCapacity?: number | null, maxCapacity?: number | null, totalCapacity?: number | null, usableCapacity?: number | null, warrantyDetails?: string | null, productStatus?: number | null, cecCapacity?: number | null, cecExpiryDate?: any | null, isActive: boolean, datasheetPath?: string | null, datasheetUrl?: string | null, datasheetName?: string | null }> };

export type GetInverterModelsQueryVariables = Exact<{
  makeUid: Scalars['String']['input'];
}>;


export type GetInverterModelsQuery = { __typename?: 'Query', inverterModels: Array<{ __typename?: 'InverterModel', uid: string, model: string, capacity?: number | null, warranty?: string | null, isActive: boolean }> };

export type GetLeadsQueryVariables = Exact<{
  page?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  source?: InputMaybe<Scalars['String']['input']>;
  isCustomerNow?: InputMaybe<Scalars['Boolean']['input']>;
  customerStatus?: InputMaybe<Scalars['Int']['input']>;
  searchAssignedTo?: InputMaybe<Scalars['String']['input']>;
  searchCreatedBy?: InputMaybe<Scalars['String']['input']>;
  branchTenant?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetLeadsQuery = { __typename?: 'Query', leads: { __typename?: 'PaginatedLeads', data: Array<(
      { __typename?: 'Lead' }
      & { ' $fragmentRefs'?: { 'LeadFieldsFragment': LeadFieldsFragment } }
    )>, meta: { __typename?: 'PaginationMeta', totalRecords: number, currentPage: number, totalPages: number, recordsPerPage: number } } };

export type GetLeadQueryVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type GetLeadQuery = { __typename?: 'Query', lead?: (
    { __typename?: 'Lead' }
    & { ' $fragmentRefs'?: { 'LeadFieldsFragment': LeadFieldsFragment } }
  ) | null };

export type GetLeadSourcesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetLeadSourcesQuery = { __typename?: 'Query', leadSources: Array<{ __typename?: 'LeadSource', id: string, uid: string, name: string, isActive?: number | null }> };

export type CheckLeadDuplicateQueryVariables = Exact<{
  number?: InputMaybe<Scalars['String']['input']>;
  address?: InputMaybe<CustomerAddressInput>;
}>;


export type CheckLeadDuplicateQuery = { __typename?: 'Query', checkLeadDuplicate?: { __typename?: 'Lead', uid: string, firstname?: string | null, lastname?: string | null, isDuplicate?: number | null } | null };

export type GetCustomerMaintenanceQueryVariables = Exact<{
  customerUid: Scalars['String']['input'];
}>;


export type GetCustomerMaintenanceQuery = { __typename?: 'Query', customerMaintenance: Array<{ __typename?: 'CustomerMaintenance', id: string, uid: string, customerUid: string, callDate: any, category?: string | null, takenCareByUid?: string | null, method?: number | null, status?: number | null, priority?: number | null, notes?: string | null, createdAt: any, createdByName?: string | null, takenCareByUser?: { __typename?: 'User', uid: string, name?: string | null } | null }> };

export type GetMaintenanceRecordQueryVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type GetMaintenanceRecordQuery = { __typename?: 'Query', maintenanceRecord?: { __typename?: 'CustomerMaintenance', id: string, uid: string, customerUid: string, callDate: any, category?: string | null, takenCareByUid?: string | null, method?: number | null, status?: number | null, priority?: number | null, notes?: string | null } | null };

export type GetItemCategoriesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetItemCategoriesQuery = { __typename?: 'Query', itemCategories: Array<{ __typename?: 'ItemCategory', id: string, uid: string, name: string, color?: string | null }> };

export type GetMaintenancesQueryVariables = Exact<{
  page?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<Scalars['Int']['input']>;
  priority?: InputMaybe<Scalars['Int']['input']>;
  category?: InputMaybe<Scalars['String']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetMaintenancesQuery = { __typename?: 'Query', maintenances: { __typename?: 'PaginatedMaintenances', data: Array<{ __typename?: 'CustomerMaintenance', id: string, uid: string, customerUid: string, callDate: any, category?: string | null, takenCareByUid?: string | null, method?: number | null, status?: number | null, priority?: number | null, notes?: string | null, createdAt: any, createdByName?: string | null, customer?: { __typename?: 'Customer', uid: string, customerId?: string | null, firstName?: string | null, lastName?: string | null, email?: string | null, number?: string | null } | null, takenCareByUser?: { __typename?: 'User', uid: string, name?: string | null } | null }>, meta: { __typename?: 'PaginationMeta', totalRecords: number, currentPage: number, totalPages: number, recordsPerPage: number } } };

export type GetMaintenanceStatsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMaintenanceStatsQuery = { __typename?: 'Query', maintenanceStats: { __typename?: 'MaintenanceStats', total: number, inProgress: number, resolved: number, cancelled: number } };

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
  maintenanceUid?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetCustomerNotesQuery = { __typename?: 'Query', customerNotes: Array<{ __typename?: 'CustomerNote', id: string, uid: string, customerUid: string, maintenanceUid?: string | null, userUid: string, message: string, followUp?: any | null, assignedTo?: string | null, type?: string | null, createdAt: any, createdByName?: string | null, assignedToUser?: { __typename?: 'User', uid: string, name?: string | null } | null, noteTypeDetails?: { __typename?: 'NoteType', uid: string, name: string, color?: string | null } | null }> };

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


export type GetPdfTermsListQuery = { __typename?: 'Query', pdfTermsList: { __typename?: 'PaginatedPdfTerms', data: Array<{ __typename?: 'PdfTerm', id: string, uid: string, name: string, rateType?: string | null, rateUids?: Array<string> | null, planUids?: Array<string> | null, isActive: boolean, isDeleted: boolean, createdAt: any, updatedAt: any }>, meta: { __typename?: 'PaginationMeta', totalRecords: number, currentPage: number, totalPages: number, recordsPerPage: number } } };

export type GetPdfTermQueryVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type GetPdfTermQuery = { __typename?: 'Query', pdfTerm?: { __typename?: 'PdfTerm', id: string, uid: string, name: string, content?: string | null, rateType?: string | null, rateUids?: Array<string> | null, planUids?: Array<string> | null, isActive: boolean, isDeleted: boolean, createdAt: any, updatedAt: any } | null };

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

export type GetPlansQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetPlansQuery = { __typename?: 'Query', plans: Array<{ __typename?: 'Plan', uid: string, tenant: string, title: string, description?: string | null, discount?: number | null, propertyType?: number | null, isSolarRequired?: boolean | null, isBatteryRequired?: boolean | null, contractTerm?: string | null, exitFee?: number | null, ratesJson?: string | null, isActive: boolean, createdAt?: any | null, updatedAt?: any | null, bonusUids?: Array<string> | null }> };

export type GetActivePlansQueryVariables = Exact<{ [key: string]: never; }>;


export type GetActivePlansQuery = { __typename?: 'Query', activePlans: Array<{ __typename?: 'Plan', uid: string, tenant: string, title: string, description?: string | null, discount?: number | null, propertyType?: number | null, isSolarRequired?: boolean | null, isBatteryRequired?: boolean | null, contractTerm?: string | null, exitFee?: number | null, ratesJson?: string | null, isActive: boolean, createdAt?: any | null, updatedAt?: any | null, bonusUids?: Array<string> | null }> };

export type GetPlanQueryVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type GetPlanQuery = { __typename?: 'Query', plan?: { __typename?: 'Plan', uid: string, tenant: string, title: string, description?: string | null, discount?: number | null, propertyType?: number | null, isSolarRequired?: boolean | null, isBatteryRequired?: boolean | null, contractTerm?: string | null, exitFee?: number | null, ratesJson?: string | null, isActive: boolean, createdAt?: any | null, updatedAt?: any | null, bonusUids?: Array<string> | null } | null };

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

export type GetRatePlanByCodeQueryVariables = Exact<{
  code: Scalars['String']['input'];
}>;


export type GetRatePlanByCodeQuery = { __typename?: 'Query', ratePlanByCode?: { __typename?: 'RatePlan', uid: string, codes?: string | null, planId?: string | null, dnsp?: number | null, state?: string | null, tariff?: string | null, type?: number | null, offers?: Array<{ __typename?: 'RateOffer', uid: string, offerName?: string | null, anytime?: number | null, cl1Supply?: number | null, cl1Usage?: number | null, cl2Supply?: number | null, cl2Usage?: number | null, demand?: number | null, demandOp?: number | null, demandP?: number | null, demandS?: number | null, fit?: number | null, fitPeak?: number | null, fitCritical?: number | null, fitVpp?: number | null, offPeak?: number | null, peak?: number | null, shoulder?: number | null, supplyCharge?: number | null, vppOrcharge?: number | null, dynamicRates?: Record<string, unknown> | null, priceUnits?: Record<string, unknown> | null }> | null } | null };

export type GetRolesQueryVariables = Exact<{
  page?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  isVisibleInLists?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type GetRolesQuery = { __typename?: 'Query', roles: { __typename?: 'PaginatedRoles', data: Array<{ __typename?: 'Role', uid: string, name: string, description?: string | null, isActive: boolean, isDeleted: boolean, createdAt: any, isIndependentUi?: boolean | null, isVisibleInLists?: boolean | null }>, meta: { __typename?: 'PaginationMeta', totalRecords: number, currentPage: number, totalPages: number, recordsPerPage: number } } };

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
  onlyVisibleRoles?: InputMaybe<Scalars['Boolean']['input']>;
  topLevelOnly?: InputMaybe<Scalars['Boolean']['input']>;
  branchTenant?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetUsersQuery = { __typename?: 'Query', users: { __typename?: 'PaginatedUsers', meta: { __typename?: 'PaginationMeta', totalRecords: number, currentPage: number, totalPages: number, recordsPerPage: number }, data: Array<{ __typename?: 'User', uid: string, email?: string | null, name?: string | null, number?: string | null, tenant: string, roleUid?: string | null, roleName?: string | null, status: UserStatus, isActive: boolean, isDeleted: boolean, createdAt: any, isMaster?: number | null, branchTenant?: string | null }> } };

export type GetUserByIdQueryVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type GetUserByIdQuery = { __typename?: 'Query', user?: { __typename?: 'User', uid: string, email?: string | null, name?: string | null, number?: string | null, tenant: string, roleUid?: string | null, roleName?: string | null, status: UserStatus, isActive: boolean, isDeleted: boolean, createdAt: any, ipAddress?: string | null, isAllowedWithoutIp?: number | null, isMaster?: number | null } | null };

export type GetGsyncStatsQueryVariables = Exact<{
  searchSigned?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetGsyncStatsQuery = { __typename?: 'Query', total: { __typename?: 'CursorPaginatedCustomers', pageInfo: { __typename?: 'PageInfo', totalCount?: number | null } }, connected: { __typename?: 'CursorPaginatedCustomers', pageInfo: { __typename?: 'PageInfo', totalCount?: number | null } }, skipConnect: { __typename?: 'CursorPaginatedCustomers', pageInfo: { __typename?: 'PageInfo', totalCount?: number | null } }, pending: { __typename?: 'CursorPaginatedCustomers', pageInfo: { __typename?: 'PageInfo', totalCount?: number | null } } };

export type GetMsatStatsQueryVariables = Exact<{
  searchSigned?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetMsatStatsQuery = { __typename?: 'Query', total: { __typename?: 'CursorPaginatedCustomers', pageInfo: { __typename?: 'PageInfo', totalCount?: number | null } }, connected: { __typename?: 'CursorPaginatedCustomers', pageInfo: { __typename?: 'PageInfo', totalCount?: number | null } }, pending: { __typename?: 'CursorPaginatedCustomers', pageInfo: { __typename?: 'PageInfo', totalCount?: number | null } } };

export type GetUtilmateStatsQueryVariables = Exact<{
  searchSigned?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetUtilmateStatsQuery = { __typename?: 'Query', total: { __typename?: 'CursorPaginatedCustomers', pageInfo: { __typename?: 'PageInfo', totalCount?: number | null } }, connected: { __typename?: 'CursorPaginatedCustomers', pageInfo: { __typename?: 'PageInfo', totalCount?: number | null } }, skipConnect: { __typename?: 'CursorPaginatedCustomers', pageInfo: { __typename?: 'PageInfo', totalCount?: number | null } }, pending: { __typename?: 'CursorPaginatedCustomers', pageInfo: { __typename?: 'PageInfo', totalCount?: number | null } } };

export const CustomerBasicFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CustomerBasicFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Customer"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"customerId"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<CustomerBasicFieldsFragment, unknown>;
export const CustomerAddressFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CustomerAddressFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomerAddress"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"streetName"}},{"kind":"Field","name":{"kind":"Name","value":"suburb"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"postcode"}},{"kind":"Field","name":{"kind":"Name","value":"country"}}]}}]} as unknown as DocumentNode<CustomerAddressFieldsFragment, unknown>;
export const UserFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"password"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"tenant"}},{"kind":"Field","name":{"kind":"Name","value":"roleUid"}},{"kind":"Field","name":{"kind":"Name","value":"roleName"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"ipAddress"}},{"kind":"Field","name":{"kind":"Name","value":"isAllowedWithoutIp"}},{"kind":"Field","name":{"kind":"Name","value":"isMaster"}},{"kind":"Field","name":{"kind":"Name","value":"branchTenant"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]} as unknown as DocumentNode<UserFieldsFragment, unknown>;
export const RatePlanFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RatePlanFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"RatePlan"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"tenant"}},{"kind":"Field","name":{"kind":"Name","value":"codes"}},{"kind":"Field","name":{"kind":"Name","value":"planId"}},{"kind":"Field","name":{"kind":"Name","value":"dnsp"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"tariff"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"vpp"}},{"kind":"Field","name":{"kind":"Name","value":"discountApplies"}},{"kind":"Field","name":{"kind":"Name","value":"discountPercentage"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"}},{"kind":"Field","name":{"kind":"Name","value":"updatedBy"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]} as unknown as DocumentNode<RatePlanFieldsFragment, unknown>;
export const RateOfferFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RateOfferFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"RateOffer"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"ratePlanUid"}},{"kind":"Field","name":{"kind":"Name","value":"tenant"}},{"kind":"Field","name":{"kind":"Name","value":"offerName"}},{"kind":"Field","name":{"kind":"Name","value":"anytime"}},{"kind":"Field","name":{"kind":"Name","value":"cl1Supply"}},{"kind":"Field","name":{"kind":"Name","value":"cl1Usage"}},{"kind":"Field","name":{"kind":"Name","value":"cl2Supply"}},{"kind":"Field","name":{"kind":"Name","value":"cl2Usage"}},{"kind":"Field","name":{"kind":"Name","value":"demand"}},{"kind":"Field","name":{"kind":"Name","value":"demandOp"}},{"kind":"Field","name":{"kind":"Name","value":"demandP"}},{"kind":"Field","name":{"kind":"Name","value":"demandS"}},{"kind":"Field","name":{"kind":"Name","value":"fit"}},{"kind":"Field","name":{"kind":"Name","value":"fitPeak"}},{"kind":"Field","name":{"kind":"Name","value":"fitCritical"}},{"kind":"Field","name":{"kind":"Name","value":"fitVpp"}},{"kind":"Field","name":{"kind":"Name","value":"offPeak"}},{"kind":"Field","name":{"kind":"Name","value":"peak"}},{"kind":"Field","name":{"kind":"Name","value":"shoulder"}},{"kind":"Field","name":{"kind":"Name","value":"supplyCharge"}},{"kind":"Field","name":{"kind":"Name","value":"vppOrcharge"}},{"kind":"Field","name":{"kind":"Name","value":"dynamicRates"}},{"kind":"Field","name":{"kind":"Name","value":"priceUnits"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"}},{"kind":"Field","name":{"kind":"Name","value":"updatedBy"}}]}}]} as unknown as DocumentNode<RateOfferFieldsFragment, unknown>;
export const LeadFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"LeadFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Lead"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"firstname"}},{"kind":"Field","name":{"kind":"Name","value":"lastname"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"source"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"unitnumber"}},{"kind":"Field","name":{"kind":"Name","value":"flatorunittype"}},{"kind":"Field","name":{"kind":"Name","value":"gnafpid"}},{"kind":"Field","name":{"kind":"Name","value":"housenumber"}},{"kind":"Field","name":{"kind":"Name","value":"buildingname"}},{"kind":"Field","name":{"kind":"Name","value":"floorlevelnumber"}},{"kind":"Field","name":{"kind":"Name","value":"streetnumber"}},{"kind":"Field","name":{"kind":"Name","value":"streetname"}},{"kind":"Field","name":{"kind":"Name","value":"streettype"}},{"kind":"Field","name":{"kind":"Name","value":"suburb"}},{"kind":"Field","name":{"kind":"Name","value":"postcode"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"nmi"}},{"kind":"Field","name":{"kind":"Name","value":"fullAddress"}},{"kind":"Field","name":{"kind":"Name","value":"referralName"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"assignedTo"}},{"kind":"Field","name":{"kind":"Name","value":"assignedToUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdByUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"branchTenant"}},{"kind":"Field","name":{"kind":"Name","value":"customerUid"}},{"kind":"Field","name":{"kind":"Name","value":"isCustomerNow"}},{"kind":"Field","name":{"kind":"Name","value":"customer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"status"}}]}},{"kind":"Field","name":{"kind":"Name","value":"isDuplicate"}}]}}]} as unknown as DocumentNode<LeadFieldsFragment, unknown>;
export const LoginDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Login"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"LoginInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"login"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accessToken"}},{"kind":"Field","name":{"kind":"Name","value":"refreshToken"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<LoginMutation, LoginMutationVariables>;
export const RefreshTokenDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RefreshToken"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"refreshToken"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"refreshToken"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"refreshToken"},"value":{"kind":"Variable","name":{"kind":"Name","value":"refreshToken"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accessToken"}},{"kind":"Field","name":{"kind":"Name","value":"refreshToken"}}]}}]}}]} as unknown as DocumentNode<RefreshTokenMutation, RefreshTokenMutationVariables>;
export const CreateBatteryMakeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateBatteryMake"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateBatteryMakeInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createBatteryMake"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"make"}},{"kind":"Field","name":{"kind":"Name","value":"shortName"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"batteryUsableCapacity"}},{"kind":"Field","name":{"kind":"Name","value":"maxBackupLoad"}},{"kind":"Field","name":{"kind":"Name","value":"batteryProdWarranty"}},{"kind":"Field","name":{"kind":"Name","value":"productStatus"}},{"kind":"Field","name":{"kind":"Name","value":"cecStatus"}},{"kind":"Field","name":{"kind":"Name","value":"pdrsStatus"}},{"kind":"Field","name":{"kind":"Name","value":"cegCapacity"}},{"kind":"Field","name":{"kind":"Name","value":"batteryCapacityKwh"}},{"kind":"Field","name":{"kind":"Name","value":"cegExpiryDate"}},{"kind":"Field","name":{"kind":"Name","value":"declaredModelCount"}},{"kind":"Field","name":{"kind":"Name","value":"actualModelRows"}},{"kind":"Field","name":{"kind":"Name","value":"minCapacity"}},{"kind":"Field","name":{"kind":"Name","value":"maxCapacity"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"datasheetPath"}},{"kind":"Field","name":{"kind":"Name","value":"datasheetUrl"}},{"kind":"Field","name":{"kind":"Name","value":"datasheetName"}}]}}]}}]} as unknown as DocumentNode<CreateBatteryMakeMutation, CreateBatteryMakeMutationVariables>;
export const UpdateBatteryMakeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateBatteryMake"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateBatteryMakeInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateBatteryMake"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uid"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"make"}},{"kind":"Field","name":{"kind":"Name","value":"shortName"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"batteryUsableCapacity"}},{"kind":"Field","name":{"kind":"Name","value":"maxBackupLoad"}},{"kind":"Field","name":{"kind":"Name","value":"batteryProdWarranty"}},{"kind":"Field","name":{"kind":"Name","value":"productStatus"}},{"kind":"Field","name":{"kind":"Name","value":"cecStatus"}},{"kind":"Field","name":{"kind":"Name","value":"pdrsStatus"}},{"kind":"Field","name":{"kind":"Name","value":"cegCapacity"}},{"kind":"Field","name":{"kind":"Name","value":"batteryCapacityKwh"}},{"kind":"Field","name":{"kind":"Name","value":"cegExpiryDate"}},{"kind":"Field","name":{"kind":"Name","value":"declaredModelCount"}},{"kind":"Field","name":{"kind":"Name","value":"actualModelRows"}},{"kind":"Field","name":{"kind":"Name","value":"minCapacity"}},{"kind":"Field","name":{"kind":"Name","value":"maxCapacity"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"datasheetPath"}},{"kind":"Field","name":{"kind":"Name","value":"datasheetUrl"}},{"kind":"Field","name":{"kind":"Name","value":"datasheetName"}}]}}]}}]} as unknown as DocumentNode<UpdateBatteryMakeMutation, UpdateBatteryMakeMutationVariables>;
export const DeleteBatteryMakeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteBatteryMake"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteBatteryMake"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uid"}}}]}]}}]} as unknown as DocumentNode<DeleteBatteryMakeMutation, DeleteBatteryMakeMutationVariables>;
export const CreateBatteryModelDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateBatteryModel"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateBatteryModelInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createBatteryModel"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"makeUid"}},{"kind":"Field","name":{"kind":"Name","value":"model"}},{"kind":"Field","name":{"kind":"Name","value":"capacity"}},{"kind":"Field","name":{"kind":"Name","value":"vppProgram"}},{"kind":"Field","name":{"kind":"Name","value":"bess2Eligible"}},{"kind":"Field","name":{"kind":"Name","value":"vpp1Eligible"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}}]}}]}}]} as unknown as DocumentNode<CreateBatteryModelMutation, CreateBatteryModelMutationVariables>;
export const UpdateBatteryModelDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateBatteryModel"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateBatteryModelInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateBatteryModel"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uid"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"makeUid"}},{"kind":"Field","name":{"kind":"Name","value":"model"}},{"kind":"Field","name":{"kind":"Name","value":"capacity"}},{"kind":"Field","name":{"kind":"Name","value":"vppProgram"}},{"kind":"Field","name":{"kind":"Name","value":"bess2Eligible"}},{"kind":"Field","name":{"kind":"Name","value":"vpp1Eligible"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}}]}}]}}]} as unknown as DocumentNode<UpdateBatteryModelMutation, UpdateBatteryModelMutationVariables>;
export const DeleteBatteryModelDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteBatteryModel"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteBatteryModel"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uid"}}}]}]}}]} as unknown as DocumentNode<DeleteBatteryModelMutation, DeleteBatteryModelMutationVariables>;
export const CreateDocumentTypeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateDocumentType"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"color"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"category"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createDocumentType"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"color"},"value":{"kind":"Variable","name":{"kind":"Name","value":"color"}}},{"kind":"Argument","name":{"kind":"Name","value":"category"},"value":{"kind":"Variable","name":{"kind":"Name","value":"category"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}}]}}]}}]} as unknown as DocumentNode<CreateDocumentTypeMutation, CreateDocumentTypeMutationVariables>;
export const UpdateDocumentTypeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateDocumentType"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"color"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"category"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"isActive"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateDocumentType"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uid"}}},{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"color"},"value":{"kind":"Variable","name":{"kind":"Name","value":"color"}}},{"kind":"Argument","name":{"kind":"Name","value":"category"},"value":{"kind":"Variable","name":{"kind":"Name","value":"category"}}},{"kind":"Argument","name":{"kind":"Name","value":"isActive"},"value":{"kind":"Variable","name":{"kind":"Name","value":"isActive"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}}]}}]}}]} as unknown as DocumentNode<UpdateDocumentTypeMutation, UpdateDocumentTypeMutationVariables>;
export const DeleteDocumentTypeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteDocumentType"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteDocumentType"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uid"}}}]}]}}]} as unknown as DocumentNode<DeleteDocumentTypeMutation, DeleteDocumentTypeMutationVariables>;
export const CreateEmailTemplateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateEmailTemplate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateEmailTemplateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createEmailTemplate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<CreateEmailTemplateMutation, CreateEmailTemplateMutationVariables>;
export const UpdateEmailTemplateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateEmailTemplate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateEmailTemplateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateEmailTemplate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uid"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<UpdateEmailTemplateMutation, UpdateEmailTemplateMutationVariables>;
export const SoftDeleteEmailTemplateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SoftDeleteEmailTemplate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"softDeleteEmailTemplate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uid"}}}]}]}}]} as unknown as DocumentNode<SoftDeleteEmailTemplateMutation, SoftDeleteEmailTemplateMutationVariables>;
export const RestoreEmailTemplateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RestoreEmailTemplate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"restoreEmailTemplate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uid"}}}]}]}}]} as unknown as DocumentNode<RestoreEmailTemplateMutation, RestoreEmailTemplateMutationVariables>;
export const SendBulkEmailDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SendBulkEmail"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"templateUid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"customerUids"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cc"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"bcc"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"attachments"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"EmailAttachmentInput"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sendBulkEmail"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"templateUid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"templateUid"}}},{"kind":"Argument","name":{"kind":"Name","value":"customerUids"},"value":{"kind":"Variable","name":{"kind":"Name","value":"customerUids"}}},{"kind":"Argument","name":{"kind":"Name","value":"cc"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cc"}}},{"kind":"Argument","name":{"kind":"Name","value":"bcc"},"value":{"kind":"Variable","name":{"kind":"Name","value":"bcc"}}},{"kind":"Argument","name":{"kind":"Name","value":"attachments"},"value":{"kind":"Variable","name":{"kind":"Name","value":"attachments"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"sentCount"}},{"kind":"Field","name":{"kind":"Name","value":"failedCount"}}]}}]}}]} as unknown as DocumentNode<SendBulkEmailMutation, SendBulkEmailMutationVariables>;
export const CreateInverterMakeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateInverterMake"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateInverterMakeInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createInverterMake"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"make"}},{"kind":"Field","name":{"kind":"Name","value":"shortName"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"minCapacity"}},{"kind":"Field","name":{"kind":"Name","value":"maxCapacity"}},{"kind":"Field","name":{"kind":"Name","value":"totalCapacity"}},{"kind":"Field","name":{"kind":"Name","value":"usableCapacity"}},{"kind":"Field","name":{"kind":"Name","value":"warrantyDetails"}},{"kind":"Field","name":{"kind":"Name","value":"productStatus"}},{"kind":"Field","name":{"kind":"Name","value":"cecCapacity"}},{"kind":"Field","name":{"kind":"Name","value":"cecExpiryDate"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"datasheetPath"}},{"kind":"Field","name":{"kind":"Name","value":"datasheetUrl"}},{"kind":"Field","name":{"kind":"Name","value":"datasheetName"}}]}}]}}]} as unknown as DocumentNode<CreateInverterMakeMutation, CreateInverterMakeMutationVariables>;
export const UpdateInverterMakeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateInverterMake"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateInverterMakeInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateInverterMake"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uid"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"make"}},{"kind":"Field","name":{"kind":"Name","value":"shortName"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"minCapacity"}},{"kind":"Field","name":{"kind":"Name","value":"maxCapacity"}},{"kind":"Field","name":{"kind":"Name","value":"totalCapacity"}},{"kind":"Field","name":{"kind":"Name","value":"usableCapacity"}},{"kind":"Field","name":{"kind":"Name","value":"warrantyDetails"}},{"kind":"Field","name":{"kind":"Name","value":"productStatus"}},{"kind":"Field","name":{"kind":"Name","value":"cecCapacity"}},{"kind":"Field","name":{"kind":"Name","value":"cecExpiryDate"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"datasheetPath"}},{"kind":"Field","name":{"kind":"Name","value":"datasheetUrl"}},{"kind":"Field","name":{"kind":"Name","value":"datasheetName"}}]}}]}}]} as unknown as DocumentNode<UpdateInverterMakeMutation, UpdateInverterMakeMutationVariables>;
export const DeleteInverterMakeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteInverterMake"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteInverterMake"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uid"}}}]}]}}]} as unknown as DocumentNode<DeleteInverterMakeMutation, DeleteInverterMakeMutationVariables>;
export const CreateInverterModelDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateInverterModel"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateInverterModelInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createInverterModel"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"makeUid"}},{"kind":"Field","name":{"kind":"Name","value":"model"}},{"kind":"Field","name":{"kind":"Name","value":"capacity"}},{"kind":"Field","name":{"kind":"Name","value":"warranty"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}}]}}]}}]} as unknown as DocumentNode<CreateInverterModelMutation, CreateInverterModelMutationVariables>;
export const UpdateInverterModelDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateInverterModel"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateInverterModelInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateInverterModel"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uid"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"makeUid"}},{"kind":"Field","name":{"kind":"Name","value":"model"}},{"kind":"Field","name":{"kind":"Name","value":"capacity"}},{"kind":"Field","name":{"kind":"Name","value":"warranty"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}}]}}]}}]} as unknown as DocumentNode<UpdateInverterModelMutation, UpdateInverterModelMutationVariables>;
export const DeleteInverterModelDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteInverterModel"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteInverterModel"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uid"}}}]}]}}]} as unknown as DocumentNode<DeleteInverterModelMutation, DeleteInverterModelMutationVariables>;
export const CreateLeadDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateLead"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateLeadInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createLead"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"LeadFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"LeadFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Lead"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"firstname"}},{"kind":"Field","name":{"kind":"Name","value":"lastname"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"source"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"unitnumber"}},{"kind":"Field","name":{"kind":"Name","value":"flatorunittype"}},{"kind":"Field","name":{"kind":"Name","value":"gnafpid"}},{"kind":"Field","name":{"kind":"Name","value":"housenumber"}},{"kind":"Field","name":{"kind":"Name","value":"buildingname"}},{"kind":"Field","name":{"kind":"Name","value":"floorlevelnumber"}},{"kind":"Field","name":{"kind":"Name","value":"streetnumber"}},{"kind":"Field","name":{"kind":"Name","value":"streetname"}},{"kind":"Field","name":{"kind":"Name","value":"streettype"}},{"kind":"Field","name":{"kind":"Name","value":"suburb"}},{"kind":"Field","name":{"kind":"Name","value":"postcode"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"nmi"}},{"kind":"Field","name":{"kind":"Name","value":"fullAddress"}},{"kind":"Field","name":{"kind":"Name","value":"referralName"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"assignedTo"}},{"kind":"Field","name":{"kind":"Name","value":"assignedToUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdByUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"branchTenant"}},{"kind":"Field","name":{"kind":"Name","value":"customerUid"}},{"kind":"Field","name":{"kind":"Name","value":"isCustomerNow"}},{"kind":"Field","name":{"kind":"Name","value":"customer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"status"}}]}},{"kind":"Field","name":{"kind":"Name","value":"isDuplicate"}}]}}]} as unknown as DocumentNode<CreateLeadMutation, CreateLeadMutationVariables>;
export const UpdateLeadDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateLead"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateLeadInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateLead"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uid"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"LeadFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"LeadFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Lead"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"firstname"}},{"kind":"Field","name":{"kind":"Name","value":"lastname"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"source"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"unitnumber"}},{"kind":"Field","name":{"kind":"Name","value":"flatorunittype"}},{"kind":"Field","name":{"kind":"Name","value":"gnafpid"}},{"kind":"Field","name":{"kind":"Name","value":"housenumber"}},{"kind":"Field","name":{"kind":"Name","value":"buildingname"}},{"kind":"Field","name":{"kind":"Name","value":"floorlevelnumber"}},{"kind":"Field","name":{"kind":"Name","value":"streetnumber"}},{"kind":"Field","name":{"kind":"Name","value":"streetname"}},{"kind":"Field","name":{"kind":"Name","value":"streettype"}},{"kind":"Field","name":{"kind":"Name","value":"suburb"}},{"kind":"Field","name":{"kind":"Name","value":"postcode"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"nmi"}},{"kind":"Field","name":{"kind":"Name","value":"fullAddress"}},{"kind":"Field","name":{"kind":"Name","value":"referralName"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"assignedTo"}},{"kind":"Field","name":{"kind":"Name","value":"assignedToUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdByUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"branchTenant"}},{"kind":"Field","name":{"kind":"Name","value":"customerUid"}},{"kind":"Field","name":{"kind":"Name","value":"isCustomerNow"}},{"kind":"Field","name":{"kind":"Name","value":"customer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"status"}}]}},{"kind":"Field","name":{"kind":"Name","value":"isDuplicate"}}]}}]} as unknown as DocumentNode<UpdateLeadMutation, UpdateLeadMutationVariables>;
export const DeleteLeadDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteLead"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteLead"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uid"}}}]}]}}]} as unknown as DocumentNode<DeleteLeadMutation, DeleteLeadMutationVariables>;
export const CreateLeadSourceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateLeadSource"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createLeadSource"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<CreateLeadSourceMutation, CreateLeadSourceMutationVariables>;
export const UpdateLeadSourceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateLeadSource"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"isActive"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateLeadSource"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uid"}}},{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"isActive"},"value":{"kind":"Variable","name":{"kind":"Name","value":"isActive"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}}]}}]}}]} as unknown as DocumentNode<UpdateLeadSourceMutation, UpdateLeadSourceMutationVariables>;
export const DeleteLeadSourceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteLeadSource"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteLeadSource"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uid"}}}]}]}}]} as unknown as DocumentNode<DeleteLeadSourceMutation, DeleteLeadSourceMutationVariables>;
export const CreateCustomerMaintenanceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateCustomerMaintenance"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"customerUid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"callDate"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Date"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"category"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"takenCareByUid"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"method"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"status"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"priority"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"notes"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createCustomerMaintenance"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"customerUid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"customerUid"}}},{"kind":"Argument","name":{"kind":"Name","value":"callDate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"callDate"}}},{"kind":"Argument","name":{"kind":"Name","value":"category"},"value":{"kind":"Variable","name":{"kind":"Name","value":"category"}}},{"kind":"Argument","name":{"kind":"Name","value":"takenCareByUid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"takenCareByUid"}}},{"kind":"Argument","name":{"kind":"Name","value":"method"},"value":{"kind":"Variable","name":{"kind":"Name","value":"method"}}},{"kind":"Argument","name":{"kind":"Name","value":"status"},"value":{"kind":"Variable","name":{"kind":"Name","value":"status"}}},{"kind":"Argument","name":{"kind":"Name","value":"priority"},"value":{"kind":"Variable","name":{"kind":"Name","value":"priority"}}},{"kind":"Argument","name":{"kind":"Name","value":"notes"},"value":{"kind":"Variable","name":{"kind":"Name","value":"notes"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"customerUid"}},{"kind":"Field","name":{"kind":"Name","value":"callDate"}},{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"takenCareByUid"}},{"kind":"Field","name":{"kind":"Name","value":"takenCareByUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"method"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"priority"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdByName"}}]}}]}}]} as unknown as DocumentNode<CreateCustomerMaintenanceMutation, CreateCustomerMaintenanceMutationVariables>;
export const UpdateCustomerMaintenanceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateCustomerMaintenance"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"category"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"takenCareByUid"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"method"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"status"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"priority"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"notes"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateCustomerMaintenance"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uid"}}},{"kind":"Argument","name":{"kind":"Name","value":"category"},"value":{"kind":"Variable","name":{"kind":"Name","value":"category"}}},{"kind":"Argument","name":{"kind":"Name","value":"takenCareByUid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"takenCareByUid"}}},{"kind":"Argument","name":{"kind":"Name","value":"method"},"value":{"kind":"Variable","name":{"kind":"Name","value":"method"}}},{"kind":"Argument","name":{"kind":"Name","value":"status"},"value":{"kind":"Variable","name":{"kind":"Name","value":"status"}}},{"kind":"Argument","name":{"kind":"Name","value":"priority"},"value":{"kind":"Variable","name":{"kind":"Name","value":"priority"}}},{"kind":"Argument","name":{"kind":"Name","value":"notes"},"value":{"kind":"Variable","name":{"kind":"Name","value":"notes"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"takenCareByUid"}},{"kind":"Field","name":{"kind":"Name","value":"method"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"priority"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<UpdateCustomerMaintenanceMutation, UpdateCustomerMaintenanceMutationVariables>;
export const DeleteCustomerMaintenanceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteCustomerMaintenance"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteCustomerMaintenance"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uid"}}}]}]}}]} as unknown as DocumentNode<DeleteCustomerMaintenanceMutation, DeleteCustomerMaintenanceMutationVariables>;
export const CreateItemCategoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateItemCategory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"color"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createItemCategory"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"color"},"value":{"kind":"Variable","name":{"kind":"Name","value":"color"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"color"}}]}}]}}]} as unknown as DocumentNode<CreateItemCategoryMutation, CreateItemCategoryMutationVariables>;
export const UpdateItemCategoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateItemCategory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"color"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"isActive"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateItemCategory"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uid"}}},{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"color"},"value":{"kind":"Variable","name":{"kind":"Name","value":"color"}}},{"kind":"Argument","name":{"kind":"Name","value":"isActive"},"value":{"kind":"Variable","name":{"kind":"Name","value":"isActive"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}}]}}]}}]} as unknown as DocumentNode<UpdateItemCategoryMutation, UpdateItemCategoryMutationVariables>;
export const DeleteItemCategoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteItemCategory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteItemCategory"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uid"}}}]}]}}]} as unknown as DocumentNode<DeleteItemCategoryMutation, DeleteItemCategoryMutationVariables>;
export const CreateCustomerNoteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateCustomerNote"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"customerUid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"message"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"followUp"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Date"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"assignedTo"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"type"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"maintenanceUid"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createCustomerNote"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"customerUid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"customerUid"}}},{"kind":"Argument","name":{"kind":"Name","value":"message"},"value":{"kind":"Variable","name":{"kind":"Name","value":"message"}}},{"kind":"Argument","name":{"kind":"Name","value":"followUp"},"value":{"kind":"Variable","name":{"kind":"Name","value":"followUp"}}},{"kind":"Argument","name":{"kind":"Name","value":"assignedTo"},"value":{"kind":"Variable","name":{"kind":"Name","value":"assignedTo"}}},{"kind":"Argument","name":{"kind":"Name","value":"type"},"value":{"kind":"Variable","name":{"kind":"Name","value":"type"}}},{"kind":"Argument","name":{"kind":"Name","value":"maintenanceUid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"maintenanceUid"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"customerUid"}},{"kind":"Field","name":{"kind":"Name","value":"maintenanceUid"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"followUp"}},{"kind":"Field","name":{"kind":"Name","value":"assignedTo"}},{"kind":"Field","name":{"kind":"Name","value":"assignedToUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"noteTypeDetails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"color"}}]}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"}},{"kind":"Field","name":{"kind":"Name","value":"createdByName"}}]}}]}}]} as unknown as DocumentNode<CreateCustomerNoteMutation, CreateCustomerNoteMutationVariables>;
export const DeleteCustomerNoteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteCustomerNote"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteCustomerNote"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uid"}}}]}]}}]} as unknown as DocumentNode<DeleteCustomerNoteMutation, DeleteCustomerNoteMutationVariables>;
export const CreateNoteTypeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateNoteType"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"color"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createNoteType"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"color"},"value":{"kind":"Variable","name":{"kind":"Name","value":"color"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"}}]}}]}}]} as unknown as DocumentNode<CreateNoteTypeMutation, CreateNoteTypeMutationVariables>;
export const DeleteNoteTypeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteNoteType"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteNoteType"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uid"}}}]}]}}]} as unknown as DocumentNode<DeleteNoteTypeMutation, DeleteNoteTypeMutationVariables>;
export const UpdateNoteTypeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateNoteType"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"color"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"isActive"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateNoteType"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uid"}}},{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"color"},"value":{"kind":"Variable","name":{"kind":"Name","value":"color"}}},{"kind":"Argument","name":{"kind":"Name","value":"isActive"},"value":{"kind":"Variable","name":{"kind":"Name","value":"isActive"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<UpdateNoteTypeMutation, UpdateNoteTypeMutationVariables>;
export const CreateNotificationEntityDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateNotificationEntity"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateNotificationEntityInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createNotificationEntity"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"fromEmail"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"userUids"}}]}}]}}]} as unknown as DocumentNode<CreateNotificationEntityMutation, CreateNotificationEntityMutationVariables>;
export const UpdateNotificationEntityDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateNotificationEntity"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateNotificationEntityInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateNotificationEntity"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uid"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"fromEmail"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"userUids"}}]}}]}}]} as unknown as DocumentNode<UpdateNotificationEntityMutation, UpdateNotificationEntityMutationVariables>;
export const DeleteNotificationEntityDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteNotificationEntity"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteNotificationEntity"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uid"}}}]}]}}]} as unknown as DocumentNode<DeleteNotificationEntityMutation, DeleteNotificationEntityMutationVariables>;
export const CreatePdfTermDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreatePdfTerm"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreatePdfTermInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createPdfTerm"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"rateType"}},{"kind":"Field","name":{"kind":"Name","value":"rateUids"}},{"kind":"Field","name":{"kind":"Name","value":"planUids"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<CreatePdfTermMutation, CreatePdfTermMutationVariables>;
export const UpdatePdfTermDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdatePdfTerm"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdatePdfTermInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updatePdfTerm"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uid"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"rateType"}},{"kind":"Field","name":{"kind":"Name","value":"rateUids"}},{"kind":"Field","name":{"kind":"Name","value":"planUids"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<UpdatePdfTermMutation, UpdatePdfTermMutationVariables>;
export const SoftDeletePdfTermDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SoftDeletePdfTerm"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"softDeletePdfTerm"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uid"}}}]}]}}]} as unknown as DocumentNode<SoftDeletePdfTermMutation, SoftDeletePdfTermMutationVariables>;
export const RestorePdfTermDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RestorePdfTerm"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"restorePdfTerm"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uid"}}}]}]}}]} as unknown as DocumentNode<RestorePdfTermMutation, RestorePdfTermMutationVariables>;
export const UpdatePermissionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdatePermission"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"roleUid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"menuUid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdatePermissionInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updatePermission"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"roleUid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"roleUid"}}},{"kind":"Argument","name":{"kind":"Name","value":"menuUid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"menuUid"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"roleUid"}},{"kind":"Field","name":{"kind":"Name","value":"menuUid"}},{"kind":"Field","name":{"kind":"Name","value":"canView"}},{"kind":"Field","name":{"kind":"Name","value":"canCreate"}},{"kind":"Field","name":{"kind":"Name","value":"canEdit"}},{"kind":"Field","name":{"kind":"Name","value":"canDelete"}}]}}]}}]} as unknown as DocumentNode<UpdatePermissionMutation, UpdatePermissionMutationVariables>;
export const UpdatePermissionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdatePermissions"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdatePermissionsInput"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updatePermissions"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"roleUid"}},{"kind":"Field","name":{"kind":"Name","value":"menuUid"}},{"kind":"Field","name":{"kind":"Name","value":"canView"}},{"kind":"Field","name":{"kind":"Name","value":"canCreate"}},{"kind":"Field","name":{"kind":"Name","value":"canEdit"}},{"kind":"Field","name":{"kind":"Name","value":"canDelete"}}]}}]}}]}}]} as unknown as DocumentNode<UpdatePermissionsMutation, UpdatePermissionsMutationVariables>;
export const UpsertRoleFeaturePermissionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpsertRoleFeaturePermission"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"roleUid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"featureUid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"isEnabled"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"upsertRoleFeaturePermission"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"roleUid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"roleUid"}}},{"kind":"Argument","name":{"kind":"Name","value":"featureUid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"featureUid"}}},{"kind":"Argument","name":{"kind":"Name","value":"isEnabled"},"value":{"kind":"Variable","name":{"kind":"Name","value":"isEnabled"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"roleUid"}},{"kind":"Field","name":{"kind":"Name","value":"featureUid"}},{"kind":"Field","name":{"kind":"Name","value":"isEnabled"}}]}}]}}]} as unknown as DocumentNode<UpsertRoleFeaturePermissionMutation, UpsertRoleFeaturePermissionMutationVariables>;
export const CreatePlanDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreatePlan"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreatePlanInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createPlan"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"tenant"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"discount"}},{"kind":"Field","name":{"kind":"Name","value":"propertyType"}},{"kind":"Field","name":{"kind":"Name","value":"isSolarRequired"}},{"kind":"Field","name":{"kind":"Name","value":"isBatteryRequired"}},{"kind":"Field","name":{"kind":"Name","value":"contractTerm"}},{"kind":"Field","name":{"kind":"Name","value":"exitFee"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"bonusUids"}}]}}]}}]} as unknown as DocumentNode<CreatePlanMutation, CreatePlanMutationVariables>;
export const UpdatePlanDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdatePlan"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdatePlanInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updatePlan"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uid"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"tenant"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"discount"}},{"kind":"Field","name":{"kind":"Name","value":"propertyType"}},{"kind":"Field","name":{"kind":"Name","value":"isSolarRequired"}},{"kind":"Field","name":{"kind":"Name","value":"isBatteryRequired"}},{"kind":"Field","name":{"kind":"Name","value":"contractTerm"}},{"kind":"Field","name":{"kind":"Name","value":"exitFee"}},{"kind":"Field","name":{"kind":"Name","value":"ratesJson"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"bonusUids"}}]}}]}}]} as unknown as DocumentNode<UpdatePlanMutation, UpdatePlanMutationVariables>;
export const DeletePlanDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeletePlan"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deletePlan"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uid"}}}]}]}}]} as unknown as DocumentNode<DeletePlanMutation, DeletePlanMutationVariables>;
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
export const CreateRoleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateRole"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateRoleInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createRole"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"isIndependentUi"}},{"kind":"Field","name":{"kind":"Name","value":"isVisibleInLists"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<CreateRoleMutation, CreateRoleMutationVariables>;
export const UpdateRoleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateRole"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateRoleInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateRole"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uid"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"isIndependentUi"}},{"kind":"Field","name":{"kind":"Name","value":"isVisibleInLists"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<UpdateRoleMutation, UpdateRoleMutationVariables>;
export const SoftDeleteRoleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SoftDeleteRole"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"softDeleteRole"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uid"}}}]}]}}]} as unknown as DocumentNode<SoftDeleteRoleMutation, SoftDeleteRoleMutationVariables>;
export const RestoreRoleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RestoreRole"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"restoreRole"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uid"}}}]}]}}]} as unknown as DocumentNode<RestoreRoleMutation, RestoreRoleMutationVariables>;
export const UpsertUserPermissionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpsertUserPermission"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpsertUserPermissionInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"upsertUserPermission"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userUid"}},{"kind":"Field","name":{"kind":"Name","value":"menuUid"}},{"kind":"Field","name":{"kind":"Name","value":"canView"}},{"kind":"Field","name":{"kind":"Name","value":"canCreate"}},{"kind":"Field","name":{"kind":"Name","value":"canEdit"}},{"kind":"Field","name":{"kind":"Name","value":"canDelete"}}]}}]}}]} as unknown as DocumentNode<UpsertUserPermissionMutation, UpsertUserPermissionMutationVariables>;
export const UpsertUserFeaturePermissionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpsertUserFeaturePermission"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpsertUserFeaturePermissionInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"upsertUserFeaturePermission"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userUid"}},{"kind":"Field","name":{"kind":"Name","value":"featureUid"}},{"kind":"Field","name":{"kind":"Name","value":"isEnabled"}}]}}]}}]} as unknown as DocumentNode<UpsertUserFeaturePermissionMutation, UpsertUserFeaturePermissionMutationVariables>;
export const CreateUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateUserInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"password"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"tenant"}},{"kind":"Field","name":{"kind":"Name","value":"roleUid"}},{"kind":"Field","name":{"kind":"Name","value":"roleName"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"ipAddress"}},{"kind":"Field","name":{"kind":"Name","value":"isAllowedWithoutIp"}},{"kind":"Field","name":{"kind":"Name","value":"isMaster"}},{"kind":"Field","name":{"kind":"Name","value":"branchTenant"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]} as unknown as DocumentNode<CreateUserMutation, CreateUserMutationVariables>;
export const UpdateUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateUserInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uid"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"password"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"tenant"}},{"kind":"Field","name":{"kind":"Name","value":"roleUid"}},{"kind":"Field","name":{"kind":"Name","value":"roleName"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"ipAddress"}},{"kind":"Field","name":{"kind":"Name","value":"isAllowedWithoutIp"}},{"kind":"Field","name":{"kind":"Name","value":"isMaster"}},{"kind":"Field","name":{"kind":"Name","value":"branchTenant"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]} as unknown as DocumentNode<UpdateUserMutation, UpdateUserMutationVariables>;
export const SoftDeleteUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SoftDeleteUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"softDeleteUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uid"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<SoftDeleteUserMutation, SoftDeleteUserMutationVariables>;
export const RestoreUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RestoreUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"restoreUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uid"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<RestoreUserMutation, RestoreUserMutationVariables>;
export const ChangePasswordDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ChangePassword"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ChangePasswordInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"changePassword"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<ChangePasswordMutation, ChangePasswordMutationVariables>;
export const AuditLogsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AuditLogs"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"tableName"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"recordId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"auditLogs"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"tableName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"tableName"}}},{"kind":"Argument","name":{"kind":"Name","value":"recordId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"recordId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"meta"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalRecords"}},{"kind":"Field","name":{"kind":"Name","value":"currentPage"}},{"kind":"Field","name":{"kind":"Name","value":"totalPages"}},{"kind":"Field","name":{"kind":"Name","value":"recordsPerPage"}}]}},{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"tableName"}},{"kind":"Field","name":{"kind":"Name","value":"recordId"}},{"kind":"Field","name":{"kind":"Name","value":"operation"}},{"kind":"Field","name":{"kind":"Name","value":"oldValues"}},{"kind":"Field","name":{"kind":"Name","value":"newValues"}},{"kind":"Field","name":{"kind":"Name","value":"changedAt"}},{"kind":"Field","name":{"kind":"Name","value":"changedBy"}}]}}]}}]}}]} as unknown as DocumentNode<AuditLogsQuery, AuditLogsQueryVariables>;
export const AuditLogDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AuditLog"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"auditLog"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uid"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"tableName"}},{"kind":"Field","name":{"kind":"Name","value":"recordId"}},{"kind":"Field","name":{"kind":"Name","value":"operation"}},{"kind":"Field","name":{"kind":"Name","value":"oldValues"}},{"kind":"Field","name":{"kind":"Name","value":"newValues"}},{"kind":"Field","name":{"kind":"Name","value":"changedAt"}},{"kind":"Field","name":{"kind":"Name","value":"changedBy"}}]}}]}}]} as unknown as DocumentNode<AuditLogQuery, AuditLogQueryVariables>;
export const RecordAuditHistoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"RecordAuditHistory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"tableName"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"recordId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"recordAuditHistory"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"tableName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"tableName"}}},{"kind":"Argument","name":{"kind":"Name","value":"recordId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"recordId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tableName"}},{"kind":"Field","name":{"kind":"Name","value":"recordId"}},{"kind":"Field","name":{"kind":"Name","value":"currentRecord"}},{"kind":"Field","name":{"kind":"Name","value":"auditHistory"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"operation"}},{"kind":"Field","name":{"kind":"Name","value":"oldValues"}},{"kind":"Field","name":{"kind":"Name","value":"newValues"}},{"kind":"Field","name":{"kind":"Name","value":"changedAt"}},{"kind":"Field","name":{"kind":"Name","value":"changedBy"}}]}}]}}]}}]} as unknown as DocumentNode<RecordAuditHistoryQuery, RecordAuditHistoryQueryVariables>;
export const MeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"tenant"}},{"kind":"Field","name":{"kind":"Name","value":"roleUid"}},{"kind":"Field","name":{"kind":"Name","value":"roleName"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"accessibleMenus"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"menuUid"}},{"kind":"Field","name":{"kind":"Name","value":"menuName"}},{"kind":"Field","name":{"kind":"Name","value":"menuCode"}},{"kind":"Field","name":{"kind":"Name","value":"parentUid"}},{"kind":"Field","name":{"kind":"Name","value":"canView"}},{"kind":"Field","name":{"kind":"Name","value":"canCreate"}},{"kind":"Field","name":{"kind":"Name","value":"canEdit"}},{"kind":"Field","name":{"kind":"Name","value":"canDelete"}},{"kind":"Field","name":{"kind":"Name","value":"sortOrder"}}]}},{"kind":"Field","name":{"kind":"Name","value":"accessibleFeatures"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"featureUid"}},{"kind":"Field","name":{"kind":"Name","value":"featureCode"}},{"kind":"Field","name":{"kind":"Name","value":"featureName"}},{"kind":"Field","name":{"kind":"Name","value":"isEnabled"}}]}},{"kind":"Field","name":{"kind":"Name","value":"isIndependentUi"}},{"kind":"Field","name":{"kind":"Name","value":"isMaster"}},{"kind":"Field","name":{"kind":"Name","value":"branchTenant"}}]}}]}}]} as unknown as DocumentNode<MeQuery, MeQueryVariables>;
export const GetBatteryMakesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetBatteryMakes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"batteryMakes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"make"}},{"kind":"Field","name":{"kind":"Name","value":"shortName"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"batteryUsableCapacity"}},{"kind":"Field","name":{"kind":"Name","value":"maxBackupLoad"}},{"kind":"Field","name":{"kind":"Name","value":"batteryProdWarranty"}},{"kind":"Field","name":{"kind":"Name","value":"productStatus"}},{"kind":"Field","name":{"kind":"Name","value":"cecStatus"}},{"kind":"Field","name":{"kind":"Name","value":"pdrsStatus"}},{"kind":"Field","name":{"kind":"Name","value":"cegCapacity"}},{"kind":"Field","name":{"kind":"Name","value":"batteryCapacityKwh"}},{"kind":"Field","name":{"kind":"Name","value":"cegExpiryDate"}},{"kind":"Field","name":{"kind":"Name","value":"declaredModelCount"}},{"kind":"Field","name":{"kind":"Name","value":"actualModelRows"}},{"kind":"Field","name":{"kind":"Name","value":"minCapacity"}},{"kind":"Field","name":{"kind":"Name","value":"maxCapacity"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"datasheetPath"}},{"kind":"Field","name":{"kind":"Name","value":"datasheetUrl"}},{"kind":"Field","name":{"kind":"Name","value":"datasheetName"}}]}}]}}]} as unknown as DocumentNode<GetBatteryMakesQuery, GetBatteryMakesQueryVariables>;
export const GetBatteryModelsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetBatteryModels"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"makeUid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"batteryModels"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"makeUid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"makeUid"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"model"}},{"kind":"Field","name":{"kind":"Name","value":"capacity"}},{"kind":"Field","name":{"kind":"Name","value":"bess2Eligible"}},{"kind":"Field","name":{"kind":"Name","value":"vpp1Eligible"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}}]}}]}}]} as unknown as DocumentNode<GetBatteryModelsQuery, GetBatteryModelsQueryVariables>;
export const GetActiveBonusesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetActiveBonuses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"activeBonuses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"contractTerm"}},{"kind":"Field","name":{"kind":"Name","value":"exitFee"}}]}}]}}]} as unknown as DocumentNode<GetActiveBonusesQuery, GetActiveBonusesQueryVariables>;
export const GetAllBonusesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAllBonuses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bonuses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"contractTerm"}},{"kind":"Field","name":{"kind":"Name","value":"exitFee"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<GetAllBonusesQuery, GetAllBonusesQueryVariables>;
export const CreateBonusDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateBonus"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateBonusInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createBonus"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"contractTerm"}},{"kind":"Field","name":{"kind":"Name","value":"exitFee"}}]}}]}}]} as unknown as DocumentNode<CreateBonusMutation, CreateBonusMutationVariables>;
export const UpdateBonusDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateBonus"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateBonusInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateBonus"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uid"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"contractTerm"}},{"kind":"Field","name":{"kind":"Name","value":"exitFee"}}]}}]}}]} as unknown as DocumentNode<UpdateBonusMutation, UpdateBonusMutationVariables>;
export const DeleteBonusDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteBonus"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteBonus"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uid"}}}]}]}}]} as unknown as DocumentNode<DeleteBonusMutation, DeleteBonusMutationVariables>;
export const CustomersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Customers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"customers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"customerId"}},{"kind":"Field","name":{"kind":"Name","value":"tenant"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"businessName"}},{"kind":"Field","name":{"kind":"Name","value":"legalName"}},{"kind":"Field","name":{"kind":"Name","value":"abn"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"dob"}},{"kind":"Field","name":{"kind":"Name","value":"phoneVerifiedAt"}},{"kind":"Field","name":{"kind":"Name","value":"propertyType"}},{"kind":"Field","name":{"kind":"Name","value":"tariffCode"}},{"kind":"Field","name":{"kind":"Name","value":"ratePlanUid"}},{"kind":"Field","name":{"kind":"Name","value":"planUid"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"utilmateStatus"}},{"kind":"Field","name":{"kind":"Name","value":"utilmateUpdatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"utilmateUploadedManually"}},{"kind":"Field","name":{"kind":"Name","value":"gender"}},{"kind":"Field","name":{"kind":"Name","value":"relationshipStatus"}},{"kind":"Field","name":{"kind":"Name","value":"enquiryAmount"}},{"kind":"Field","name":{"kind":"Name","value":"checkCreditScore"}},{"kind":"Field","name":{"kind":"Name","value":"employerName"}},{"kind":"Field","name":{"kind":"Name","value":"riskStatus"}},{"kind":"Field","name":{"kind":"Name","value":"signDate"}},{"kind":"Field","name":{"kind":"Name","value":"signedPdfPath"}},{"kind":"Field","name":{"kind":"Name","value":"pdfAudit"}},{"kind":"Field","name":{"kind":"Name","value":"emailSent"}},{"kind":"Field","name":{"kind":"Name","value":"discount"}},{"kind":"Field","name":{"kind":"Name","value":"previousCustomerUid"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"offerEmailSentAt"}},{"kind":"Field","name":{"kind":"Name","value":"pdrsEmailSent"}},{"kind":"Field","name":{"kind":"Name","value":"pdrsEmailSentAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"leadUid"}},{"kind":"Field","name":{"kind":"Name","value":"portalName"}},{"kind":"Field","name":{"kind":"Name","value":"selectedBonuses"}},{"kind":"Field","name":{"kind":"Name","value":"isConsentRead"}},{"kind":"Field","name":{"kind":"Name","value":"medicareIrn"}},{"kind":"Field","name":{"kind":"Name","value":"medicareCardType"}},{"kind":"Field","name":{"kind":"Name","value":"previousBill"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"filename"}},{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"size"}},{"kind":"Field","name":{"kind":"Name","value":"mimeType"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"}},{"kind":"Field","name":{"kind":"Name","value":"createdByUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"identityProof"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"filename"}},{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"size"}},{"kind":"Field","name":{"kind":"Name","value":"mimeType"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"}},{"kind":"Field","name":{"kind":"Name","value":"createdByUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"}},{"kind":"Field","name":{"kind":"Name","value":"updatedBy"}},{"kind":"Field","name":{"kind":"Name","value":"deletedBy"}},{"kind":"Field","name":{"kind":"Name","value":"ratePlan"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"tenant"}},{"kind":"Field","name":{"kind":"Name","value":"codes"}},{"kind":"Field","name":{"kind":"Name","value":"planId"}},{"kind":"Field","name":{"kind":"Name","value":"dnsp"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"tariff"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"vpp"}},{"kind":"Field","name":{"kind":"Name","value":"discountApplies"}},{"kind":"Field","name":{"kind":"Name","value":"discountPercentage"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"}},{"kind":"Field","name":{"kind":"Name","value":"updatedBy"}},{"kind":"Field","name":{"kind":"Name","value":"deletedBy"}},{"kind":"Field","name":{"kind":"Name","value":"offers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"ratePlanUid"}},{"kind":"Field","name":{"kind":"Name","value":"tenant"}},{"kind":"Field","name":{"kind":"Name","value":"offerName"}},{"kind":"Field","name":{"kind":"Name","value":"anytime"}},{"kind":"Field","name":{"kind":"Name","value":"cl1Supply"}},{"kind":"Field","name":{"kind":"Name","value":"cl1Usage"}},{"kind":"Field","name":{"kind":"Name","value":"cl2Supply"}},{"kind":"Field","name":{"kind":"Name","value":"cl2Usage"}},{"kind":"Field","name":{"kind":"Name","value":"demand"}},{"kind":"Field","name":{"kind":"Name","value":"demandOp"}},{"kind":"Field","name":{"kind":"Name","value":"demandP"}},{"kind":"Field","name":{"kind":"Name","value":"demandS"}},{"kind":"Field","name":{"kind":"Name","value":"fit"}},{"kind":"Field","name":{"kind":"Name","value":"fitPeak"}},{"kind":"Field","name":{"kind":"Name","value":"fitCritical"}},{"kind":"Field","name":{"kind":"Name","value":"fitVpp"}},{"kind":"Field","name":{"kind":"Name","value":"offPeak"}},{"kind":"Field","name":{"kind":"Name","value":"peak"}},{"kind":"Field","name":{"kind":"Name","value":"shoulder"}},{"kind":"Field","name":{"kind":"Name","value":"supplyCharge"}},{"kind":"Field","name":{"kind":"Name","value":"vppOrcharge"}},{"kind":"Field","name":{"kind":"Name","value":"dynamicRates"}},{"kind":"Field","name":{"kind":"Name","value":"priceUnits"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"}},{"kind":"Field","name":{"kind":"Name","value":"updatedBy"}},{"kind":"Field","name":{"kind":"Name","value":"deletedBy"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"enrollmentDetails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"customerUid"}},{"kind":"Field","name":{"kind":"Name","value":"saletype"}},{"kind":"Field","name":{"kind":"Name","value":"connectiondate"}},{"kind":"Field","name":{"kind":"Name","value":"idtype"}},{"kind":"Field","name":{"kind":"Name","value":"idnumber"}},{"kind":"Field","name":{"kind":"Name","value":"idstate"}},{"kind":"Field","name":{"kind":"Name","value":"idcountry"}},{"kind":"Field","name":{"kind":"Name","value":"idexpiry"}},{"kind":"Field","name":{"kind":"Name","value":"concession"}},{"kind":"Field","name":{"kind":"Name","value":"lifesupport"}},{"kind":"Field","name":{"kind":"Name","value":"billingpreference"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"address"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"customerUid"}},{"kind":"Field","name":{"kind":"Name","value":"unitNumber"}},{"kind":"Field","name":{"kind":"Name","value":"flatOrUnitType"}},{"kind":"Field","name":{"kind":"Name","value":"gnafPid"}},{"kind":"Field","name":{"kind":"Name","value":"houseNumber"}},{"kind":"Field","name":{"kind":"Name","value":"buildingName"}},{"kind":"Field","name":{"kind":"Name","value":"floorLevelNumber"}},{"kind":"Field","name":{"kind":"Name","value":"streetNumber"}},{"kind":"Field","name":{"kind":"Name","value":"streetName"}},{"kind":"Field","name":{"kind":"Name","value":"streetType"}},{"kind":"Field","name":{"kind":"Name","value":"suburb"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"postcode"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"nmi"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"solarDetails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"customerUid"}},{"kind":"Field","name":{"kind":"Name","value":"hassolar"}},{"kind":"Field","name":{"kind":"Name","value":"solarcapacity"}},{"kind":"Field","name":{"kind":"Name","value":"invertercapacity"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"batteryDetails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"customerUid"}},{"kind":"Field","name":{"kind":"Name","value":"isbattery"}},{"kind":"Field","name":{"kind":"Name","value":"batterybrand"}},{"kind":"Field","name":{"kind":"Name","value":"snnumber"}},{"kind":"Field","name":{"kind":"Name","value":"batterycapacity"}},{"kind":"Field","name":{"kind":"Name","value":"exportlimit"}},{"kind":"Field","name":{"kind":"Name","value":"batterymodel"}},{"kind":"Field","name":{"kind":"Name","value":"inverterCapacity"}},{"kind":"Field","name":{"kind":"Name","value":"checkCode"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"msatDetails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"customerUid"}},{"kind":"Field","name":{"kind":"Name","value":"msatConnected"}},{"kind":"Field","name":{"kind":"Name","value":"msatConnectedAt"}},{"kind":"Field","name":{"kind":"Name","value":"msatUpdatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"vppDetails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"customerUid"}},{"kind":"Field","name":{"kind":"Name","value":"vpp"}},{"kind":"Field","name":{"kind":"Name","value":"vppConnected"}},{"kind":"Field","name":{"kind":"Name","value":"vppSignupBonus"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"history"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"version"}},{"kind":"Field","name":{"kind":"Name","value":"customerSnapshot"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"meta"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalRecords"}},{"kind":"Field","name":{"kind":"Name","value":"currentPage"}},{"kind":"Field","name":{"kind":"Name","value":"totalPages"}},{"kind":"Field","name":{"kind":"Name","value":"recordsPerPage"}}]}}]}}]}}]} as unknown as DocumentNode<CustomersQuery, CustomersQueryVariables>;
export const CustomersListDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CustomersList"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"customers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"customerId"}},{"kind":"Field","name":{"kind":"Name","value":"tenant"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"businessName"}},{"kind":"Field","name":{"kind":"Name","value":"legalName"}},{"kind":"Field","name":{"kind":"Name","value":"abn"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"dob"}},{"kind":"Field","name":{"kind":"Name","value":"phoneVerifiedAt"}},{"kind":"Field","name":{"kind":"Name","value":"propertyType"}},{"kind":"Field","name":{"kind":"Name","value":"tariffCode"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"utilmateStatus"}},{"kind":"Field","name":{"kind":"Name","value":"utilmateUpdatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"utilmateUploadedManually"}},{"kind":"Field","name":{"kind":"Name","value":"gender"}},{"kind":"Field","name":{"kind":"Name","value":"relationshipStatus"}},{"kind":"Field","name":{"kind":"Name","value":"enquiryAmount"}},{"kind":"Field","name":{"kind":"Name","value":"checkCreditScore"}},{"kind":"Field","name":{"kind":"Name","value":"employerName"}},{"kind":"Field","name":{"kind":"Name","value":"riskStatus"}},{"kind":"Field","name":{"kind":"Name","value":"signDate"}},{"kind":"Field","name":{"kind":"Name","value":"signedPdfPath"}},{"kind":"Field","name":{"kind":"Name","value":"pdfAudit"}},{"kind":"Field","name":{"kind":"Name","value":"emailSent"}},{"kind":"Field","name":{"kind":"Name","value":"discount"}},{"kind":"Field","name":{"kind":"Name","value":"previousCustomerUid"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}},{"kind":"Field","name":{"kind":"Name","value":"leadUid"}},{"kind":"Field","name":{"kind":"Name","value":"portalName"}},{"kind":"Field","name":{"kind":"Name","value":"isConsentRead"}},{"kind":"Field","name":{"kind":"Name","value":"medicareIrn"}},{"kind":"Field","name":{"kind":"Name","value":"medicareCardType"}},{"kind":"Field","name":{"kind":"Name","value":"previousBill"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"filename"}},{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"size"}},{"kind":"Field","name":{"kind":"Name","value":"mimeType"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"}},{"kind":"Field","name":{"kind":"Name","value":"createdByUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"identityProof"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"filename"}},{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"size"}},{"kind":"Field","name":{"kind":"Name","value":"mimeType"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"}},{"kind":"Field","name":{"kind":"Name","value":"createdByUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"}},{"kind":"Field","name":{"kind":"Name","value":"updatedBy"}},{"kind":"Field","name":{"kind":"Name","value":"deletedBy"}},{"kind":"Field","name":{"kind":"Name","value":"ratePlan"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"tenant"}},{"kind":"Field","name":{"kind":"Name","value":"codes"}},{"kind":"Field","name":{"kind":"Name","value":"planId"}},{"kind":"Field","name":{"kind":"Name","value":"dnsp"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"tariff"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"vpp"}},{"kind":"Field","name":{"kind":"Name","value":"discountApplies"}},{"kind":"Field","name":{"kind":"Name","value":"discountPercentage"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"}},{"kind":"Field","name":{"kind":"Name","value":"updatedBy"}},{"kind":"Field","name":{"kind":"Name","value":"deletedBy"}}]}},{"kind":"Field","name":{"kind":"Name","value":"address"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"customerUid"}},{"kind":"Field","name":{"kind":"Name","value":"unitNumber"}},{"kind":"Field","name":{"kind":"Name","value":"flatOrUnitType"}},{"kind":"Field","name":{"kind":"Name","value":"gnafPid"}},{"kind":"Field","name":{"kind":"Name","value":"houseNumber"}},{"kind":"Field","name":{"kind":"Name","value":"buildingName"}},{"kind":"Field","name":{"kind":"Name","value":"floorLevelNumber"}},{"kind":"Field","name":{"kind":"Name","value":"streetNumber"}},{"kind":"Field","name":{"kind":"Name","value":"streetName"}},{"kind":"Field","name":{"kind":"Name","value":"streetType"}},{"kind":"Field","name":{"kind":"Name","value":"suburb"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"postcode"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"nmi"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"solarDetails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"customerUid"}},{"kind":"Field","name":{"kind":"Name","value":"hassolar"}},{"kind":"Field","name":{"kind":"Name","value":"solarcapacity"}},{"kind":"Field","name":{"kind":"Name","value":"invertercapacity"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"vppDetails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"customerUid"}},{"kind":"Field","name":{"kind":"Name","value":"vpp"}},{"kind":"Field","name":{"kind":"Name","value":"vppConnected"}},{"kind":"Field","name":{"kind":"Name","value":"vppSignupBonus"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"meta"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalRecords"}},{"kind":"Field","name":{"kind":"Name","value":"currentPage"}},{"kind":"Field","name":{"kind":"Name","value":"totalPages"}},{"kind":"Field","name":{"kind":"Name","value":"recordsPerPage"}}]}}]}}]}}]} as unknown as DocumentNode<CustomersListQuery, CustomersListQueryVariables>;
export const GetAllFilteredCustomerIdsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAllFilteredCustomerIds"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"searchId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"searchName"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"searchMobile"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"searchAddress"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"searchTariff"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"searchDnsp"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"searchDiscount"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"searchStatus"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"searchVpp"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"searchVppConnected"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"searchUtilmateStatus"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"searchMsatConnected"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"searchRiskStatus"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"searchAssignedTo"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"searchPortal"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"includeDeleted"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"customersCursor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"10000"}},{"kind":"Argument","name":{"kind":"Name","value":"searchId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchId"}}},{"kind":"Argument","name":{"kind":"Name","value":"searchName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchName"}}},{"kind":"Argument","name":{"kind":"Name","value":"searchMobile"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchMobile"}}},{"kind":"Argument","name":{"kind":"Name","value":"searchAddress"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchAddress"}}},{"kind":"Argument","name":{"kind":"Name","value":"searchTariff"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchTariff"}}},{"kind":"Argument","name":{"kind":"Name","value":"searchDnsp"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchDnsp"}}},{"kind":"Argument","name":{"kind":"Name","value":"searchDiscount"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchDiscount"}}},{"kind":"Argument","name":{"kind":"Name","value":"searchStatus"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchStatus"}}},{"kind":"Argument","name":{"kind":"Name","value":"searchRiskStatus"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchRiskStatus"}}},{"kind":"Argument","name":{"kind":"Name","value":"searchVpp"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchVpp"}}},{"kind":"Argument","name":{"kind":"Name","value":"searchVppConnected"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchVppConnected"}}},{"kind":"Argument","name":{"kind":"Name","value":"searchUtilmateStatus"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchUtilmateStatus"}}},{"kind":"Argument","name":{"kind":"Name","value":"searchMsatConnected"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchMsatConnected"}}},{"kind":"Argument","name":{"kind":"Name","value":"searchAssignedTo"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchAssignedTo"}}},{"kind":"Argument","name":{"kind":"Name","value":"searchPortal"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchPortal"}}},{"kind":"Argument","name":{"kind":"Name","value":"includeDeleted"},"value":{"kind":"Variable","name":{"kind":"Name","value":"includeDeleted"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}}]}}]}}]}}]} as unknown as DocumentNode<GetAllFilteredCustomerIdsQuery, GetAllFilteredCustomerIdsQueryVariables>;
export const CustomersCursorDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CustomersCursor"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"search"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"discount"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"status"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"searchId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"searchName"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"searchMobile"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"searchAddress"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"searchTariff"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"searchDnsp"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"searchDiscount"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"searchStatus"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"searchRiskStatus"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"searchVpp"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"searchVppConnected"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"searchVppApiPushed"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"searchUtilmateStatus"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"searchUtilmateApiPushed"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"searchMsatConnected"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"searchAssignedTo"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"searchPortal"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"searchSigned"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"includeDeleted"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"customersCursor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after"}}},{"kind":"Argument","name":{"kind":"Name","value":"search"},"value":{"kind":"Variable","name":{"kind":"Name","value":"search"}}},{"kind":"Argument","name":{"kind":"Name","value":"discount"},"value":{"kind":"Variable","name":{"kind":"Name","value":"discount"}}},{"kind":"Argument","name":{"kind":"Name","value":"status"},"value":{"kind":"Variable","name":{"kind":"Name","value":"status"}}},{"kind":"Argument","name":{"kind":"Name","value":"searchId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchId"}}},{"kind":"Argument","name":{"kind":"Name","value":"searchName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchName"}}},{"kind":"Argument","name":{"kind":"Name","value":"searchMobile"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchMobile"}}},{"kind":"Argument","name":{"kind":"Name","value":"searchAddress"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchAddress"}}},{"kind":"Argument","name":{"kind":"Name","value":"searchTariff"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchTariff"}}},{"kind":"Argument","name":{"kind":"Name","value":"searchDnsp"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchDnsp"}}},{"kind":"Argument","name":{"kind":"Name","value":"searchDiscount"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchDiscount"}}},{"kind":"Argument","name":{"kind":"Name","value":"searchStatus"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchStatus"}}},{"kind":"Argument","name":{"kind":"Name","value":"searchRiskStatus"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchRiskStatus"}}},{"kind":"Argument","name":{"kind":"Name","value":"searchVpp"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchVpp"}}},{"kind":"Argument","name":{"kind":"Name","value":"searchVppConnected"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchVppConnected"}}},{"kind":"Argument","name":{"kind":"Name","value":"searchVppApiPushed"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchVppApiPushed"}}},{"kind":"Argument","name":{"kind":"Name","value":"searchUtilmateStatus"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchUtilmateStatus"}}},{"kind":"Argument","name":{"kind":"Name","value":"searchUtilmateApiPushed"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchUtilmateApiPushed"}}},{"kind":"Argument","name":{"kind":"Name","value":"searchMsatConnected"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchMsatConnected"}}},{"kind":"Argument","name":{"kind":"Name","value":"searchAssignedTo"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchAssignedTo"}}},{"kind":"Argument","name":{"kind":"Name","value":"searchPortal"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchPortal"}}},{"kind":"Argument","name":{"kind":"Name","value":"searchSigned"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchSigned"}}},{"kind":"Argument","name":{"kind":"Name","value":"includeDeleted"},"value":{"kind":"Variable","name":{"kind":"Name","value":"includeDeleted"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"customerId"}},{"kind":"Field","name":{"kind":"Name","value":"tenant"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"legalName"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"propertyType"}},{"kind":"Field","name":{"kind":"Name","value":"tariffCode"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"utilmateStatus"}},{"kind":"Field","name":{"kind":"Name","value":"utilmateUpdatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"utilmateUploadedManually"}},{"kind":"Field","name":{"kind":"Name","value":"riskStatus"}},{"kind":"Field","name":{"kind":"Name","value":"leadUid"}},{"kind":"Field","name":{"kind":"Name","value":"portalName"}},{"kind":"Field","name":{"kind":"Name","value":"source"}},{"kind":"Field","name":{"kind":"Name","value":"referralName"}},{"kind":"Field","name":{"kind":"Name","value":"msatDetails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"msatConnected"}},{"kind":"Field","name":{"kind":"Name","value":"msatUpdatedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"discount"}},{"kind":"Field","name":{"kind":"Name","value":"pdrsEmailSent"}},{"kind":"Field","name":{"kind":"Name","value":"pdrsEmailSentAt"}},{"kind":"Field","name":{"kind":"Name","value":"isWithoutSignature"}},{"kind":"Field","name":{"kind":"Name","value":"ratePlan"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"dnsp"}}]}},{"kind":"Field","name":{"kind":"Name","value":"vppDetails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"vpp"}},{"kind":"Field","name":{"kind":"Name","value":"vppConnected"}},{"kind":"Field","name":{"kind":"Name","value":"vppSignupBonus"}},{"kind":"Field","name":{"kind":"Name","value":"vppApiPushed"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"batteryDetails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isbattery"}},{"kind":"Field","name":{"kind":"Name","value":"batterybrand"}},{"kind":"Field","name":{"kind":"Name","value":"snnumber"}},{"kind":"Field","name":{"kind":"Name","value":"batterycapacity"}},{"kind":"Field","name":{"kind":"Name","value":"exportlimit"}},{"kind":"Field","name":{"kind":"Name","value":"batterymodel"}},{"kind":"Field","name":{"kind":"Name","value":"inverterCapacity"}}]}},{"kind":"Field","name":{"kind":"Name","value":"utilmateDetails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"utilmateConnected"}},{"kind":"Field","name":{"kind":"Name","value":"siteIdentifier"}},{"kind":"Field","name":{"kind":"Name","value":"accountNumber"}},{"kind":"Field","name":{"kind":"Name","value":"utilmateConnectedAt"}},{"kind":"Field","name":{"kind":"Name","value":"utilmateApiPushed"}}]}},{"kind":"Field","name":{"kind":"Name","value":"address"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fullAddress"}},{"kind":"Field","name":{"kind":"Name","value":"nmi"}}]}},{"kind":"Field","name":{"kind":"Name","value":"assignedToUid"}},{"kind":"Field","name":{"kind":"Name","value":"assignedToUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"}},{"kind":"Field","name":{"kind":"Name","value":"createdByUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"referenceId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"hasPreviousPage"}},{"kind":"Field","name":{"kind":"Name","value":"startCursor"}},{"kind":"Field","name":{"kind":"Name","value":"startCursor"}},{"kind":"Field","name":{"kind":"Name","value":"endCursor"}},{"kind":"Field","name":{"kind":"Name","value":"totalCount"}}]}}]}}]}}]} as unknown as DocumentNode<CustomersCursorQuery, CustomersCursorQueryVariables>;
export const GetCustomerByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCustomerById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"customer"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uid"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"assignedToUid"}},{"kind":"Field","name":{"kind":"Name","value":"assignedToUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}},{"kind":"Field","name":{"kind":"Name","value":"selectedBonuses"}},{"kind":"Field","name":{"kind":"Name","value":"isConsentRead"}},{"kind":"Field","name":{"kind":"Name","value":"medicareIrn"}},{"kind":"Field","name":{"kind":"Name","value":"medicareCardType"}},{"kind":"Field","name":{"kind":"Name","value":"customerId"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"businessName"}},{"kind":"Field","name":{"kind":"Name","value":"legalName"}},{"kind":"Field","name":{"kind":"Name","value":"abn"}},{"kind":"Field","name":{"kind":"Name","value":"showAsBusinessName"}},{"kind":"Field","name":{"kind":"Name","value":"showName"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"phoneVerifiedAt"}},{"kind":"Field","name":{"kind":"Name","value":"dob"}},{"kind":"Field","name":{"kind":"Name","value":"propertyType"}},{"kind":"Field","name":{"kind":"Name","value":"tariffCode"}},{"kind":"Field","name":{"kind":"Name","value":"ratePlanUid"}},{"kind":"Field","name":{"kind":"Name","value":"planUid"}},{"kind":"Field","name":{"kind":"Name","value":"plan"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"ratesJson"}},{"kind":"Field","name":{"kind":"Name","value":"discount"}}]}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"discount"}},{"kind":"Field","name":{"kind":"Name","value":"signDate"}},{"kind":"Field","name":{"kind":"Name","value":"signedPdfPath"}},{"kind":"Field","name":{"kind":"Name","value":"emailSent"}},{"kind":"Field","name":{"kind":"Name","value":"utilmateStatus"}},{"kind":"Field","name":{"kind":"Name","value":"rateVersion"}},{"kind":"Field","name":{"kind":"Name","value":"gender"}},{"kind":"Field","name":{"kind":"Name","value":"relationshipStatus"}},{"kind":"Field","name":{"kind":"Name","value":"enquiryAmount"}},{"kind":"Field","name":{"kind":"Name","value":"checkCreditScore"}},{"kind":"Field","name":{"kind":"Name","value":"employerName"}},{"kind":"Field","name":{"kind":"Name","value":"creditScore"}},{"kind":"Field","name":{"kind":"Name","value":"isCreditScoreFetched"}},{"kind":"Field","name":{"kind":"Name","value":"isWithoutSignature"}},{"kind":"Field","name":{"kind":"Name","value":"riskStatus"}},{"kind":"Field","name":{"kind":"Name","value":"emailLogCount"}},{"kind":"Field","name":{"kind":"Name","value":"offerVersion"}},{"kind":"Field","name":{"kind":"Name","value":"viewCode"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"offerEmailSentAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"portalName"}},{"kind":"Field","name":{"kind":"Name","value":"source"}},{"kind":"Field","name":{"kind":"Name","value":"referralName"}},{"kind":"Field","name":{"kind":"Name","value":"pdrsEmailSent"}},{"kind":"Field","name":{"kind":"Name","value":"pdrsEmailSentAt"}},{"kind":"Field","name":{"kind":"Name","value":"address"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"customerUid"}},{"kind":"Field","name":{"kind":"Name","value":"unitNumber"}},{"kind":"Field","name":{"kind":"Name","value":"flatOrUnitType"}},{"kind":"Field","name":{"kind":"Name","value":"gnafPid"}},{"kind":"Field","name":{"kind":"Name","value":"houseNumber"}},{"kind":"Field","name":{"kind":"Name","value":"buildingName"}},{"kind":"Field","name":{"kind":"Name","value":"floorLevelNumber"}},{"kind":"Field","name":{"kind":"Name","value":"streetNumber"}},{"kind":"Field","name":{"kind":"Name","value":"streetName"}},{"kind":"Field","name":{"kind":"Name","value":"streetType"}},{"kind":"Field","name":{"kind":"Name","value":"suburb"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"postcode"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"nmi"}},{"kind":"Field","name":{"kind":"Name","value":"fullAddress"}}]}},{"kind":"Field","name":{"kind":"Name","value":"ratePlan"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"codes"}},{"kind":"Field","name":{"kind":"Name","value":"planId"}},{"kind":"Field","name":{"kind":"Name","value":"dnsp"}},{"kind":"Field","name":{"kind":"Name","value":"tariff"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"vpp"}},{"kind":"Field","name":{"kind":"Name","value":"discountApplies"}},{"kind":"Field","name":{"kind":"Name","value":"discountPercentage"}},{"kind":"Field","name":{"kind":"Name","value":"offers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"offerName"}},{"kind":"Field","name":{"kind":"Name","value":"anytime"}},{"kind":"Field","name":{"kind":"Name","value":"cl1Supply"}},{"kind":"Field","name":{"kind":"Name","value":"cl1Usage"}},{"kind":"Field","name":{"kind":"Name","value":"cl2Supply"}},{"kind":"Field","name":{"kind":"Name","value":"cl2Usage"}},{"kind":"Field","name":{"kind":"Name","value":"demand"}},{"kind":"Field","name":{"kind":"Name","value":"demandOp"}},{"kind":"Field","name":{"kind":"Name","value":"demandP"}},{"kind":"Field","name":{"kind":"Name","value":"demandS"}},{"kind":"Field","name":{"kind":"Name","value":"fit"}},{"kind":"Field","name":{"kind":"Name","value":"fitPeak"}},{"kind":"Field","name":{"kind":"Name","value":"fitCritical"}},{"kind":"Field","name":{"kind":"Name","value":"fitVpp"}},{"kind":"Field","name":{"kind":"Name","value":"offPeak"}},{"kind":"Field","name":{"kind":"Name","value":"peak"}},{"kind":"Field","name":{"kind":"Name","value":"shoulder"}},{"kind":"Field","name":{"kind":"Name","value":"supplyCharge"}},{"kind":"Field","name":{"kind":"Name","value":"vppOrcharge"}},{"kind":"Field","name":{"kind":"Name","value":"dynamicRates"}},{"kind":"Field","name":{"kind":"Name","value":"priceUnits"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"vppDetails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"vpp"}},{"kind":"Field","name":{"kind":"Name","value":"vppConnected"}},{"kind":"Field","name":{"kind":"Name","value":"vppSignupBonus"}}]}},{"kind":"Field","name":{"kind":"Name","value":"solarDetails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hassolar"}},{"kind":"Field","name":{"kind":"Name","value":"solarcapacity"}},{"kind":"Field","name":{"kind":"Name","value":"invertercapacity"}}]}},{"kind":"Field","name":{"kind":"Name","value":"batteryDetails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isbattery"}},{"kind":"Field","name":{"kind":"Name","value":"batterybrand"}},{"kind":"Field","name":{"kind":"Name","value":"snnumber"}},{"kind":"Field","name":{"kind":"Name","value":"batterycapacity"}},{"kind":"Field","name":{"kind":"Name","value":"exportlimit"}},{"kind":"Field","name":{"kind":"Name","value":"batterymodel"}},{"kind":"Field","name":{"kind":"Name","value":"inverterCapacity"}}]}},{"kind":"Field","name":{"kind":"Name","value":"enrollmentDetails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"saletype"}},{"kind":"Field","name":{"kind":"Name","value":"connectiondate"}},{"kind":"Field","name":{"kind":"Name","value":"idtype"}},{"kind":"Field","name":{"kind":"Name","value":"idnumber"}},{"kind":"Field","name":{"kind":"Name","value":"idstate"}},{"kind":"Field","name":{"kind":"Name","value":"idcountry"}},{"kind":"Field","name":{"kind":"Name","value":"idexpiry"}},{"kind":"Field","name":{"kind":"Name","value":"concession"}},{"kind":"Field","name":{"kind":"Name","value":"lifesupport"}},{"kind":"Field","name":{"kind":"Name","value":"billingpreference"}},{"kind":"Field","name":{"kind":"Name","value":"licenseNumber"}},{"kind":"Field","name":{"kind":"Name","value":"licenseState"}},{"kind":"Field","name":{"kind":"Name","value":"licenseExpiry"}},{"kind":"Field","name":{"kind":"Name","value":"licenseCardNumber"}},{"kind":"Field","name":{"kind":"Name","value":"medicareCardType"}},{"kind":"Field","name":{"kind":"Name","value":"medicareIrn"}}]}},{"kind":"Field","name":{"kind":"Name","value":"debitDetails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"optIn"}},{"kind":"Field","name":{"kind":"Name","value":"accountType"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"bankName"}},{"kind":"Field","name":{"kind":"Name","value":"bankAddress"}},{"kind":"Field","name":{"kind":"Name","value":"bsb"}},{"kind":"Field","name":{"kind":"Name","value":"accountNumber"}},{"kind":"Field","name":{"kind":"Name","value":"paymentFrequency"}},{"kind":"Field","name":{"kind":"Name","value":"firstDebitDate"}}]}},{"kind":"Field","name":{"kind":"Name","value":"utilmateDetails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"utilmateConnected"}}]}},{"kind":"Field","name":{"kind":"Name","value":"previousBill"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"filename"}},{"kind":"Field","name":{"kind":"Name","value":"path"}}]}},{"kind":"Field","name":{"kind":"Name","value":"identityProof"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"filename"}},{"kind":"Field","name":{"kind":"Name","value":"path"}}]}},{"kind":"Field","name":{"kind":"Name","value":"licenseDocument"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"filename"}},{"kind":"Field","name":{"kind":"Name","value":"path"}}]}},{"kind":"Field","name":{"kind":"Name","value":"msatDetails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"msatConnected"}},{"kind":"Field","name":{"kind":"Name","value":"msatConnectedAt"}},{"kind":"Field","name":{"kind":"Name","value":"msatUpdatedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"vppCertificateDetails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"certificateNo"}},{"kind":"Field","name":{"kind":"Name","value":"isAllRequiredFilled"}},{"kind":"Field","name":{"kind":"Name","value":"isVppCertificateEmailSent"}}]}}]}}]}}]} as unknown as DocumentNode<GetCustomerByIdQuery, GetCustomerByIdQueryVariables>;
export const GetCustomerGeneralDetailsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCustomerGeneralDetails"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"customer"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uid"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"isConsentRead"}},{"kind":"Field","name":{"kind":"Name","value":"medicareIrn"}},{"kind":"Field","name":{"kind":"Name","value":"medicareCardType"}},{"kind":"Field","name":{"kind":"Name","value":"customerId"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"businessName"}},{"kind":"Field","name":{"kind":"Name","value":"legalName"}},{"kind":"Field","name":{"kind":"Name","value":"abn"}},{"kind":"Field","name":{"kind":"Name","value":"showAsBusinessName"}},{"kind":"Field","name":{"kind":"Name","value":"showName"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"phoneVerifiedAt"}},{"kind":"Field","name":{"kind":"Name","value":"dob"}},{"kind":"Field","name":{"kind":"Name","value":"propertyType"}},{"kind":"Field","name":{"kind":"Name","value":"tariffCode"}},{"kind":"Field","name":{"kind":"Name","value":"ratePlanUid"}},{"kind":"Field","name":{"kind":"Name","value":"planUid"}},{"kind":"Field","name":{"kind":"Name","value":"plan"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"ratesJson"}},{"kind":"Field","name":{"kind":"Name","value":"discount"}}]}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"discount"}},{"kind":"Field","name":{"kind":"Name","value":"signDate"}},{"kind":"Field","name":{"kind":"Name","value":"signedPdfPath"}},{"kind":"Field","name":{"kind":"Name","value":"emailSent"}},{"kind":"Field","name":{"kind":"Name","value":"utilmateStatus"}},{"kind":"Field","name":{"kind":"Name","value":"rateVersion"}},{"kind":"Field","name":{"kind":"Name","value":"gender"}},{"kind":"Field","name":{"kind":"Name","value":"relationshipStatus"}},{"kind":"Field","name":{"kind":"Name","value":"enquiryAmount"}},{"kind":"Field","name":{"kind":"Name","value":"checkCreditScore"}},{"kind":"Field","name":{"kind":"Name","value":"employerName"}},{"kind":"Field","name":{"kind":"Name","value":"creditScore"}},{"kind":"Field","name":{"kind":"Name","value":"isCreditScoreFetched"}},{"kind":"Field","name":{"kind":"Name","value":"isWithoutSignature"}},{"kind":"Field","name":{"kind":"Name","value":"riskStatus"}},{"kind":"Field","name":{"kind":"Name","value":"emailLogCount"}},{"kind":"Field","name":{"kind":"Name","value":"offerVersion"}},{"kind":"Field","name":{"kind":"Name","value":"viewCode"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"offerEmailSentAt"}},{"kind":"Field","name":{"kind":"Name","value":"pdrsEmailSent"}},{"kind":"Field","name":{"kind":"Name","value":"pdrsEmailSentAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"portalName"}},{"kind":"Field","name":{"kind":"Name","value":"source"}},{"kind":"Field","name":{"kind":"Name","value":"referralName"}},{"kind":"Field","name":{"kind":"Name","value":"address"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"customerUid"}},{"kind":"Field","name":{"kind":"Name","value":"unitNumber"}},{"kind":"Field","name":{"kind":"Name","value":"flatOrUnitType"}},{"kind":"Field","name":{"kind":"Name","value":"gnafPid"}},{"kind":"Field","name":{"kind":"Name","value":"houseNumber"}},{"kind":"Field","name":{"kind":"Name","value":"buildingName"}},{"kind":"Field","name":{"kind":"Name","value":"floorLevelNumber"}},{"kind":"Field","name":{"kind":"Name","value":"streetNumber"}},{"kind":"Field","name":{"kind":"Name","value":"streetName"}},{"kind":"Field","name":{"kind":"Name","value":"streetType"}},{"kind":"Field","name":{"kind":"Name","value":"suburb"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"postcode"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"nmi"}},{"kind":"Field","name":{"kind":"Name","value":"fullAddress"}}]}},{"kind":"Field","name":{"kind":"Name","value":"ratePlan"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"codes"}},{"kind":"Field","name":{"kind":"Name","value":"planId"}},{"kind":"Field","name":{"kind":"Name","value":"dnsp"}},{"kind":"Field","name":{"kind":"Name","value":"tariff"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"vpp"}},{"kind":"Field","name":{"kind":"Name","value":"discountApplies"}},{"kind":"Field","name":{"kind":"Name","value":"discountPercentage"}},{"kind":"Field","name":{"kind":"Name","value":"offers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"offerName"}},{"kind":"Field","name":{"kind":"Name","value":"anytime"}},{"kind":"Field","name":{"kind":"Name","value":"cl1Supply"}},{"kind":"Field","name":{"kind":"Name","value":"cl1Usage"}},{"kind":"Field","name":{"kind":"Name","value":"cl2Supply"}},{"kind":"Field","name":{"kind":"Name","value":"cl2Usage"}},{"kind":"Field","name":{"kind":"Name","value":"demand"}},{"kind":"Field","name":{"kind":"Name","value":"demandOp"}},{"kind":"Field","name":{"kind":"Name","value":"demandP"}},{"kind":"Field","name":{"kind":"Name","value":"demandS"}},{"kind":"Field","name":{"kind":"Name","value":"fit"}},{"kind":"Field","name":{"kind":"Name","value":"fitPeak"}},{"kind":"Field","name":{"kind":"Name","value":"fitCritical"}},{"kind":"Field","name":{"kind":"Name","value":"fitVpp"}},{"kind":"Field","name":{"kind":"Name","value":"offPeak"}},{"kind":"Field","name":{"kind":"Name","value":"peak"}},{"kind":"Field","name":{"kind":"Name","value":"shoulder"}},{"kind":"Field","name":{"kind":"Name","value":"supplyCharge"}},{"kind":"Field","name":{"kind":"Name","value":"vppOrcharge"}},{"kind":"Field","name":{"kind":"Name","value":"dynamicRates"}},{"kind":"Field","name":{"kind":"Name","value":"priceUnits"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"vppDetails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"vpp"}},{"kind":"Field","name":{"kind":"Name","value":"vppConnected"}},{"kind":"Field","name":{"kind":"Name","value":"vppSignupBonus"}}]}},{"kind":"Field","name":{"kind":"Name","value":"solarDetails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hassolar"}},{"kind":"Field","name":{"kind":"Name","value":"solarcapacity"}},{"kind":"Field","name":{"kind":"Name","value":"invertercapacity"}}]}},{"kind":"Field","name":{"kind":"Name","value":"batteryDetails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"batterybrand"}},{"kind":"Field","name":{"kind":"Name","value":"snnumber"}},{"kind":"Field","name":{"kind":"Name","value":"batterycapacity"}},{"kind":"Field","name":{"kind":"Name","value":"exportlimit"}},{"kind":"Field","name":{"kind":"Name","value":"batterymodel"}},{"kind":"Field","name":{"kind":"Name","value":"inverterCapacity"}}]}},{"kind":"Field","name":{"kind":"Name","value":"enrollmentDetails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"saletype"}},{"kind":"Field","name":{"kind":"Name","value":"connectiondate"}},{"kind":"Field","name":{"kind":"Name","value":"idtype"}},{"kind":"Field","name":{"kind":"Name","value":"idnumber"}},{"kind":"Field","name":{"kind":"Name","value":"idstate"}},{"kind":"Field","name":{"kind":"Name","value":"idcountry"}},{"kind":"Field","name":{"kind":"Name","value":"idexpiry"}},{"kind":"Field","name":{"kind":"Name","value":"concession"}},{"kind":"Field","name":{"kind":"Name","value":"lifesupport"}},{"kind":"Field","name":{"kind":"Name","value":"billingpreference"}},{"kind":"Field","name":{"kind":"Name","value":"licenseNumber"}},{"kind":"Field","name":{"kind":"Name","value":"licenseState"}},{"kind":"Field","name":{"kind":"Name","value":"licenseExpiry"}},{"kind":"Field","name":{"kind":"Name","value":"licenseCardNumber"}},{"kind":"Field","name":{"kind":"Name","value":"medicareCardType"}},{"kind":"Field","name":{"kind":"Name","value":"medicareIrn"}}]}},{"kind":"Field","name":{"kind":"Name","value":"debitDetails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"optIn"}},{"kind":"Field","name":{"kind":"Name","value":"accountType"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"bankName"}},{"kind":"Field","name":{"kind":"Name","value":"bankAddress"}},{"kind":"Field","name":{"kind":"Name","value":"bsb"}},{"kind":"Field","name":{"kind":"Name","value":"accountNumber"}},{"kind":"Field","name":{"kind":"Name","value":"paymentFrequency"}},{"kind":"Field","name":{"kind":"Name","value":"firstDebitDate"}}]}},{"kind":"Field","name":{"kind":"Name","value":"utilmateDetails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"utilmateConnected"}}]}},{"kind":"Field","name":{"kind":"Name","value":"previousBill"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"customerUid"}},{"kind":"Field","name":{"kind":"Name","value":"filename"}},{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"size"}},{"kind":"Field","name":{"kind":"Name","value":"mimeType"}},{"kind":"Field","name":{"kind":"Name","value":"documentType"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"category"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"}},{"kind":"Field","name":{"kind":"Name","value":"createdByUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"identityProof"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"customerUid"}},{"kind":"Field","name":{"kind":"Name","value":"filename"}},{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"size"}},{"kind":"Field","name":{"kind":"Name","value":"mimeType"}},{"kind":"Field","name":{"kind":"Name","value":"documentType"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"category"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"}},{"kind":"Field","name":{"kind":"Name","value":"createdByUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"licenseDocument"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"customerUid"}},{"kind":"Field","name":{"kind":"Name","value":"filename"}},{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"size"}},{"kind":"Field","name":{"kind":"Name","value":"mimeType"}},{"kind":"Field","name":{"kind":"Name","value":"documentType"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"category"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"}},{"kind":"Field","name":{"kind":"Name","value":"createdByUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"documents"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"customerUid"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"filename"}},{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"size"}},{"kind":"Field","name":{"kind":"Name","value":"mimeType"}},{"kind":"Field","name":{"kind":"Name","value":"documentType"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"category"}}]}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"}},{"kind":"Field","name":{"kind":"Name","value":"createdByUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"vppCertificateDetails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isAllRequiredFilled"}},{"kind":"Field","name":{"kind":"Name","value":"isVppCertificateEmailSent"}},{"kind":"Field","name":{"kind":"Name","value":"isVppCertificateEmailSentAt"}},{"kind":"Field","name":{"kind":"Name","value":"batteryManufacturer"}},{"kind":"Field","name":{"kind":"Name","value":"batterySerialNumber"}},{"kind":"Field","name":{"kind":"Name","value":"batteryUsableCapacity"}},{"kind":"Field","name":{"kind":"Name","value":"inverterManufacturer"}},{"kind":"Field","name":{"kind":"Name","value":"inverterSnNumbers"}},{"kind":"Field","name":{"kind":"Name","value":"inverterCapacity"}}]}},{"kind":"Field","name":{"kind":"Name","value":"msatDetails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"msatConnected"}},{"kind":"Field","name":{"kind":"Name","value":"msatConnectedAt"}},{"kind":"Field","name":{"kind":"Name","value":"msatUpdatedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"vppCertificateDetails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"certificateNo"}},{"kind":"Field","name":{"kind":"Name","value":"isAllRequiredFilled"}},{"kind":"Field","name":{"kind":"Name","value":"isVppCertificateEmailSent"}}]}}]}}]}}]} as unknown as DocumentNode<GetCustomerGeneralDetailsQuery, GetCustomerGeneralDetailsQueryVariables>;
export const GetCustomerSolarVppDetailsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCustomerSolarVppDetails"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"customer"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uid"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"vppDetails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"customerUid"}},{"kind":"Field","name":{"kind":"Name","value":"vpp"}},{"kind":"Field","name":{"kind":"Name","value":"vppConnected"}},{"kind":"Field","name":{"kind":"Name","value":"vppSignupBonus"}}]}},{"kind":"Field","name":{"kind":"Name","value":"solarDetails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"customerUid"}},{"kind":"Field","name":{"kind":"Name","value":"hassolar"}},{"kind":"Field","name":{"kind":"Name","value":"solarcapacity"}},{"kind":"Field","name":{"kind":"Name","value":"invertercapacity"}}]}},{"kind":"Field","name":{"kind":"Name","value":"batteryDetails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"customerUid"}},{"kind":"Field","name":{"kind":"Name","value":"isbattery"}},{"kind":"Field","name":{"kind":"Name","value":"batterybrand"}},{"kind":"Field","name":{"kind":"Name","value":"snnumber"}},{"kind":"Field","name":{"kind":"Name","value":"batterycapacity"}},{"kind":"Field","name":{"kind":"Name","value":"exportlimit"}},{"kind":"Field","name":{"kind":"Name","value":"batterymodel"}},{"kind":"Field","name":{"kind":"Name","value":"inverterCapacity"}},{"kind":"Field","name":{"kind":"Name","value":"checkCode"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"vppCertificateDetails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"batteryManufacturer"}},{"kind":"Field","name":{"kind":"Name","value":"batterySerialNumber"}},{"kind":"Field","name":{"kind":"Name","value":"batteryUsableCapacity"}},{"kind":"Field","name":{"kind":"Name","value":"inverterManufacturer"}},{"kind":"Field","name":{"kind":"Name","value":"inverterSnNumbers"}},{"kind":"Field","name":{"kind":"Name","value":"inverterCapacity"}}]}}]}}]}}]} as unknown as DocumentNode<GetCustomerSolarVppDetailsQuery, GetCustomerSolarVppDetailsQueryVariables>;
export const GetCustomerVppCertificateDetailsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCustomerVppCertificateDetails"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"customer"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uid"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"vppCertificateDetails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"certificateNo"}},{"kind":"Field","name":{"kind":"Name","value":"issueDate"}},{"kind":"Field","name":{"kind":"Name","value":"batteryManufacturer"}},{"kind":"Field","name":{"kind":"Name","value":"batteryModel"}},{"kind":"Field","name":{"kind":"Name","value":"batterySerialNumber"}},{"kind":"Field","name":{"kind":"Name","value":"batteryInstalledDate"}},{"kind":"Field","name":{"kind":"Name","value":"batteryUsableCapacity"}},{"kind":"Field","name":{"kind":"Name","value":"batteryPortConnected"}},{"kind":"Field","name":{"kind":"Name","value":"inverterManufacturer"}},{"kind":"Field","name":{"kind":"Name","value":"inverterModel"}},{"kind":"Field","name":{"kind":"Name","value":"inverterSnNumbers"}},{"kind":"Field","name":{"kind":"Name","value":"inverterCapacity"}},{"kind":"Field","name":{"kind":"Name","value":"isLifeSupportEquipment"}},{"kind":"Field","name":{"kind":"Name","value":"ifYesDetails"}},{"kind":"Field","name":{"kind":"Name","value":"internetConnectionType"}},{"kind":"Field","name":{"kind":"Name","value":"internetOtherText"}},{"kind":"Field","name":{"kind":"Name","value":"modemRouterLocation"}},{"kind":"Field","name":{"kind":"Name","value":"apiIntegration"}},{"kind":"Field","name":{"kind":"Name","value":"remoteChargesCommandTest"}},{"kind":"Field","name":{"kind":"Name","value":"remoteChargesCommandTestAt"}},{"kind":"Field","name":{"kind":"Name","value":"remoteDischargesCommandTest"}},{"kind":"Field","name":{"kind":"Name","value":"remoteDischargesCommandTestAt"}},{"kind":"Field","name":{"kind":"Name","value":"stateOfChangeMonitoring"}},{"kind":"Field","name":{"kind":"Name","value":"stateOfChangeMonitoringAt"}},{"kind":"Field","name":{"kind":"Name","value":"gridExportVerification"}},{"kind":"Field","name":{"kind":"Name","value":"gridExportVerificationAt"}},{"kind":"Field","name":{"kind":"Name","value":"gridImportVerification"}},{"kind":"Field","name":{"kind":"Name","value":"gridImportVerificationAt"}},{"kind":"Field","name":{"kind":"Name","value":"communicationFailSafeTest"}},{"kind":"Field","name":{"kind":"Name","value":"communicationFailSafeTestAt"}},{"kind":"Field","name":{"kind":"Name","value":"testResult"}},{"kind":"Field","name":{"kind":"Name","value":"additionalNotes"}},{"kind":"Field","name":{"kind":"Name","value":"isAllRequiredFilled"}},{"kind":"Field","name":{"kind":"Name","value":"isVppCertificateEmailSent"}},{"kind":"Field","name":{"kind":"Name","value":"isVppCertificateEmailSentAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"batteryDetails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"batterybrand"}},{"kind":"Field","name":{"kind":"Name","value":"snnumber"}},{"kind":"Field","name":{"kind":"Name","value":"batterycapacity"}},{"kind":"Field","name":{"kind":"Name","value":"batterymodel"}},{"kind":"Field","name":{"kind":"Name","value":"inverterCapacity"}}]}}]}}]}}]} as unknown as DocumentNode<GetCustomerVppCertificateDetailsQuery, GetCustomerVppCertificateDetailsQueryVariables>;
export const GetCustomerDebitDetailsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCustomerDebitDetails"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"customer"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uid"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"debitDetails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"customerUid"}},{"kind":"Field","name":{"kind":"Name","value":"accountType"}},{"kind":"Field","name":{"kind":"Name","value":"companyName"}},{"kind":"Field","name":{"kind":"Name","value":"abn"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"bankName"}},{"kind":"Field","name":{"kind":"Name","value":"bankAddress"}},{"kind":"Field","name":{"kind":"Name","value":"bsb"}},{"kind":"Field","name":{"kind":"Name","value":"accountNumber"}},{"kind":"Field","name":{"kind":"Name","value":"paymentFrequency"}},{"kind":"Field","name":{"kind":"Name","value":"firstDebitDate"}},{"kind":"Field","name":{"kind":"Name","value":"optIn"}}]}}]}}]}}]} as unknown as DocumentNode<GetCustomerDebitDetailsQuery, GetCustomerDebitDetailsQueryVariables>;
export const GetCustomerUtilmateDetailsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCustomerUtilmateDetails"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"customer"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uid"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"utilmateDetails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"customerUid"}},{"kind":"Field","name":{"kind":"Name","value":"siteIdentifier"}},{"kind":"Field","name":{"kind":"Name","value":"accountNumber"}},{"kind":"Field","name":{"kind":"Name","value":"utilmateConnected"}},{"kind":"Field","name":{"kind":"Name","value":"utilmateConnectedAt"}},{"kind":"Field","name":{"kind":"Name","value":"utilmateApiPushed"}}]}},{"kind":"Field","name":{"kind":"Name","value":"msatDetails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"customerUid"}},{"kind":"Field","name":{"kind":"Name","value":"msatConnected"}},{"kind":"Field","name":{"kind":"Name","value":"msatConnectedAt"}},{"kind":"Field","name":{"kind":"Name","value":"msatUpdatedAt"}}]}}]}}]}}]} as unknown as DocumentNode<GetCustomerUtilmateDetailsQuery, GetCustomerUtilmateDetailsQueryVariables>;
export const GetCustomerDocumentsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCustomerDocuments"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"customer"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uid"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"previousBill"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"customerUid"}},{"kind":"Field","name":{"kind":"Name","value":"filename"}},{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"size"}},{"kind":"Field","name":{"kind":"Name","value":"mimeType"}},{"kind":"Field","name":{"kind":"Name","value":"documentType"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"category"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"}},{"kind":"Field","name":{"kind":"Name","value":"createdByUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"identityProof"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"customerUid"}},{"kind":"Field","name":{"kind":"Name","value":"filename"}},{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"size"}},{"kind":"Field","name":{"kind":"Name","value":"mimeType"}},{"kind":"Field","name":{"kind":"Name","value":"documentType"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"category"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"}},{"kind":"Field","name":{"kind":"Name","value":"createdByUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"licenseDocument"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"customerUid"}},{"kind":"Field","name":{"kind":"Name","value":"filename"}},{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"size"}},{"kind":"Field","name":{"kind":"Name","value":"mimeType"}},{"kind":"Field","name":{"kind":"Name","value":"documentType"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"category"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"}},{"kind":"Field","name":{"kind":"Name","value":"createdByUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"documents"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"customerUid"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"filename"}},{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"size"}},{"kind":"Field","name":{"kind":"Name","value":"mimeType"}},{"kind":"Field","name":{"kind":"Name","value":"documentType"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"category"}}]}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"}},{"kind":"Field","name":{"kind":"Name","value":"createdByUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"vppCertificateDetails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"certificateNo"}},{"kind":"Field","name":{"kind":"Name","value":"isAllRequiredFilled"}},{"kind":"Field","name":{"kind":"Name","value":"isVppCertificateEmailSent"}}]}}]}}]}}]} as unknown as DocumentNode<GetCustomerDocumentsQuery, GetCustomerDocumentsQueryVariables>;
export const CheckAddressExistsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CheckAddressExists"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"address"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CustomerAddressInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"checkAddressExists"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"address"},"value":{"kind":"Variable","name":{"kind":"Name","value":"address"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"customerId"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"businessName"}},{"kind":"Field","name":{"kind":"Name","value":"abn"}}]}}]}}]} as unknown as DocumentNode<CheckAddressExistsQuery, CheckAddressExistsQueryVariables>;
export const CheckNmiExistsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CheckNmiExists"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"nmi"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"checkNmiExists"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"nmi"},"value":{"kind":"Variable","name":{"kind":"Name","value":"nmi"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"customerId"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"businessName"}},{"kind":"Field","name":{"kind":"Name","value":"abn"}}]}}]}}]} as unknown as DocumentNode<CheckNmiExistsQuery, CheckNmiExistsQueryVariables>;
export const ValidateCustomerAccessCodeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ValidateCustomerAccessCode"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"customerId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"code"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"validateCustomerAccessCode"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"customerId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"customerId"}}},{"kind":"Argument","name":{"kind":"Name","value":"code"},"value":{"kind":"Variable","name":{"kind":"Name","value":"code"}}}]}]}}]} as unknown as DocumentNode<ValidateCustomerAccessCodeQuery, ValidateCustomerAccessCodeQueryVariables>;
export const GetCustomerByCustomerIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCustomerByCustomerId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"customerId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"customerByCustomerId"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"customerId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"customerId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"selectedBonuses"}},{"kind":"Field","name":{"kind":"Name","value":"customerId"}},{"kind":"Field","name":{"kind":"Name","value":"portalName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"businessName"}},{"kind":"Field","name":{"kind":"Name","value":"abn"}},{"kind":"Field","name":{"kind":"Name","value":"showAsBusinessName"}},{"kind":"Field","name":{"kind":"Name","value":"showName"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"dob"}},{"kind":"Field","name":{"kind":"Name","value":"propertyType"}},{"kind":"Field","name":{"kind":"Name","value":"tariffCode"}},{"kind":"Field","name":{"kind":"Name","value":"ratePlanUid"}},{"kind":"Field","name":{"kind":"Name","value":"ratePlan"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"codes"}},{"kind":"Field","name":{"kind":"Name","value":"planId"}},{"kind":"Field","name":{"kind":"Name","value":"dnsp"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"tariff"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"vpp"}},{"kind":"Field","name":{"kind":"Name","value":"offers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"offerName"}},{"kind":"Field","name":{"kind":"Name","value":"anytime"}},{"kind":"Field","name":{"kind":"Name","value":"cl1Supply"}},{"kind":"Field","name":{"kind":"Name","value":"cl1Usage"}},{"kind":"Field","name":{"kind":"Name","value":"cl2Supply"}},{"kind":"Field","name":{"kind":"Name","value":"cl2Usage"}},{"kind":"Field","name":{"kind":"Name","value":"demand"}},{"kind":"Field","name":{"kind":"Name","value":"demandOp"}},{"kind":"Field","name":{"kind":"Name","value":"demandP"}},{"kind":"Field","name":{"kind":"Name","value":"demandS"}},{"kind":"Field","name":{"kind":"Name","value":"fit"}},{"kind":"Field","name":{"kind":"Name","value":"fitPeak"}},{"kind":"Field","name":{"kind":"Name","value":"fitCritical"}},{"kind":"Field","name":{"kind":"Name","value":"fitVpp"}},{"kind":"Field","name":{"kind":"Name","value":"offPeak"}},{"kind":"Field","name":{"kind":"Name","value":"peak"}},{"kind":"Field","name":{"kind":"Name","value":"shoulder"}},{"kind":"Field","name":{"kind":"Name","value":"supplyCharge"}},{"kind":"Field","name":{"kind":"Name","value":"vppOrcharge"}},{"kind":"Field","name":{"kind":"Name","value":"dynamicRates"}},{"kind":"Field","name":{"kind":"Name","value":"priceUnits"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"planUid"}},{"kind":"Field","name":{"kind":"Name","value":"plan"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"ratesJson"}},{"kind":"Field","name":{"kind":"Name","value":"discount"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"bonusUids"}}]}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"discount"}},{"kind":"Field","name":{"kind":"Name","value":"signDate"}},{"kind":"Field","name":{"kind":"Name","value":"emailSent"}},{"kind":"Field","name":{"kind":"Name","value":"offerEmailSentAt"}},{"kind":"Field","name":{"kind":"Name","value":"utilmateStatus"}},{"kind":"Field","name":{"kind":"Name","value":"viewCode"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"phoneVerifiedAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"address"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"customerUid"}},{"kind":"Field","name":{"kind":"Name","value":"unitNumber"}},{"kind":"Field","name":{"kind":"Name","value":"flatOrUnitType"}},{"kind":"Field","name":{"kind":"Name","value":"gnafPid"}},{"kind":"Field","name":{"kind":"Name","value":"houseNumber"}},{"kind":"Field","name":{"kind":"Name","value":"buildingName"}},{"kind":"Field","name":{"kind":"Name","value":"floorLevelNumber"}},{"kind":"Field","name":{"kind":"Name","value":"streetNumber"}},{"kind":"Field","name":{"kind":"Name","value":"streetName"}},{"kind":"Field","name":{"kind":"Name","value":"streetType"}},{"kind":"Field","name":{"kind":"Name","value":"suburb"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"postcode"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"nmi"}},{"kind":"Field","name":{"kind":"Name","value":"fullAddress"}}]}},{"kind":"Field","name":{"kind":"Name","value":"msatDetails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"customerUid"}},{"kind":"Field","name":{"kind":"Name","value":"msatConnected"}},{"kind":"Field","name":{"kind":"Name","value":"msatConnectedAt"}},{"kind":"Field","name":{"kind":"Name","value":"msatUpdatedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"vppDetails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"customerUid"}},{"kind":"Field","name":{"kind":"Name","value":"vpp"}},{"kind":"Field","name":{"kind":"Name","value":"vppConnected"}},{"kind":"Field","name":{"kind":"Name","value":"vppSignupBonus"}}]}},{"kind":"Field","name":{"kind":"Name","value":"solarDetails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"customerUid"}},{"kind":"Field","name":{"kind":"Name","value":"hassolar"}},{"kind":"Field","name":{"kind":"Name","value":"solarcapacity"}},{"kind":"Field","name":{"kind":"Name","value":"invertercapacity"}}]}},{"kind":"Field","name":{"kind":"Name","value":"batteryDetails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"customerUid"}},{"kind":"Field","name":{"kind":"Name","value":"isbattery"}},{"kind":"Field","name":{"kind":"Name","value":"batterybrand"}},{"kind":"Field","name":{"kind":"Name","value":"snnumber"}},{"kind":"Field","name":{"kind":"Name","value":"batterycapacity"}},{"kind":"Field","name":{"kind":"Name","value":"exportlimit"}},{"kind":"Field","name":{"kind":"Name","value":"batterymodel"}},{"kind":"Field","name":{"kind":"Name","value":"inverterCapacity"}},{"kind":"Field","name":{"kind":"Name","value":"checkCode"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"debitDetails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"customerUid"}},{"kind":"Field","name":{"kind":"Name","value":"accountType"}},{"kind":"Field","name":{"kind":"Name","value":"companyName"}},{"kind":"Field","name":{"kind":"Name","value":"abn"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"bankName"}},{"kind":"Field","name":{"kind":"Name","value":"bankAddress"}},{"kind":"Field","name":{"kind":"Name","value":"bsb"}},{"kind":"Field","name":{"kind":"Name","value":"accountNumber"}},{"kind":"Field","name":{"kind":"Name","value":"paymentFrequency"}},{"kind":"Field","name":{"kind":"Name","value":"firstDebitDate"}},{"kind":"Field","name":{"kind":"Name","value":"optIn"}}]}},{"kind":"Field","name":{"kind":"Name","value":"rateVersion"}},{"kind":"Field","name":{"kind":"Name","value":"offerVersion"}},{"kind":"Field","name":{"kind":"Name","value":"ratePlan"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"codes"}},{"kind":"Field","name":{"kind":"Name","value":"planId"}},{"kind":"Field","name":{"kind":"Name","value":"dnsp"}},{"kind":"Field","name":{"kind":"Name","value":"tariff"}},{"kind":"Field","name":{"kind":"Name","value":"vpp"}},{"kind":"Field","name":{"kind":"Name","value":"offers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"offerName"}},{"kind":"Field","name":{"kind":"Name","value":"anytime"}},{"kind":"Field","name":{"kind":"Name","value":"cl1Supply"}},{"kind":"Field","name":{"kind":"Name","value":"cl1Usage"}},{"kind":"Field","name":{"kind":"Name","value":"cl2Supply"}},{"kind":"Field","name":{"kind":"Name","value":"cl2Usage"}},{"kind":"Field","name":{"kind":"Name","value":"demand"}},{"kind":"Field","name":{"kind":"Name","value":"demandOp"}},{"kind":"Field","name":{"kind":"Name","value":"demandP"}},{"kind":"Field","name":{"kind":"Name","value":"demandS"}},{"kind":"Field","name":{"kind":"Name","value":"fit"}},{"kind":"Field","name":{"kind":"Name","value":"fitPeak"}},{"kind":"Field","name":{"kind":"Name","value":"fitCritical"}},{"kind":"Field","name":{"kind":"Name","value":"fitVpp"}},{"kind":"Field","name":{"kind":"Name","value":"offPeak"}},{"kind":"Field","name":{"kind":"Name","value":"peak"}},{"kind":"Field","name":{"kind":"Name","value":"shoulder"}},{"kind":"Field","name":{"kind":"Name","value":"supplyCharge"}},{"kind":"Field","name":{"kind":"Name","value":"vppOrcharge"}},{"kind":"Field","name":{"kind":"Name","value":"dynamicRates"}},{"kind":"Field","name":{"kind":"Name","value":"priceUnits"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"enrollmentDetails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"customerUid"}},{"kind":"Field","name":{"kind":"Name","value":"saletype"}},{"kind":"Field","name":{"kind":"Name","value":"connectiondate"}},{"kind":"Field","name":{"kind":"Name","value":"idtype"}},{"kind":"Field","name":{"kind":"Name","value":"idnumber"}},{"kind":"Field","name":{"kind":"Name","value":"idstate"}},{"kind":"Field","name":{"kind":"Name","value":"idcountry"}},{"kind":"Field","name":{"kind":"Name","value":"idexpiry"}},{"kind":"Field","name":{"kind":"Name","value":"concession"}},{"kind":"Field","name":{"kind":"Name","value":"lifesupport"}},{"kind":"Field","name":{"kind":"Name","value":"billingpreference"}}]}},{"kind":"Field","name":{"kind":"Name","value":"documents"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"customerUid"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"filename"}},{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"size"}},{"kind":"Field","name":{"kind":"Name","value":"mimeType"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"}},{"kind":"Field","name":{"kind":"Name","value":"createdByUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"vppCertificateDetails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"certificateNo"}},{"kind":"Field","name":{"kind":"Name","value":"isAllRequiredFilled"}},{"kind":"Field","name":{"kind":"Name","value":"isVppCertificateEmailSent"}}]}}]}}]}}]} as unknown as DocumentNode<GetCustomerByCustomerIdQuery, GetCustomerByCustomerIdQueryVariables>;
export const GetDocumentTypesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetDocumentTypes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"documentTypes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}}]}}]}}]} as unknown as DocumentNode<GetDocumentTypesQuery, GetDocumentTypesQueryVariables>;
export const GetRiskStatusesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetRiskStatuses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"riskStatuses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"scoreMin"}},{"kind":"Field","name":{"kind":"Name","value":"scoreMax"}},{"kind":"Field","name":{"kind":"Name","value":"manualOffer"}},{"kind":"Field","name":{"kind":"Name","value":"sortOrder"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}}]}}]}}]} as unknown as DocumentNode<GetRiskStatusesQuery, GetRiskStatusesQueryVariables>;
export const SearchCustomersBasicDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SearchCustomersBasic"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"searchName"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"customersCursor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"searchName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchName"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"customerId"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"address"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fullAddress"}}]}}]}}]}}]}}]} as unknown as DocumentNode<SearchCustomersBasicQuery, SearchCustomersBasicQueryVariables>;
export const GetCustomerBillingInfoDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCustomerBillingInfo"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"customer"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uid"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"customerId"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"creditScore"}},{"kind":"Field","name":{"kind":"Name","value":"riskStatus"}},{"kind":"Field","name":{"kind":"Name","value":"address"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fullAddress"}}]}},{"kind":"Field","name":{"kind":"Name","value":"enrollmentDetails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"billingpreference"}}]}},{"kind":"Field","name":{"kind":"Name","value":"debitDetails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"optIn"}}]}},{"kind":"Field","name":{"kind":"Name","value":"utilmateDetails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountNumber"}},{"kind":"Field","name":{"kind":"Name","value":"siteIdentifier"}}]}}]}}]}}]} as unknown as DocumentNode<GetCustomerBillingInfoQuery, GetCustomerBillingInfoQueryVariables>;
export const GetNextCustomerIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetNextCustomerId"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getNextCustomerId"}}]}}]} as unknown as DocumentNode<GetNextCustomerIdQuery, GetNextCustomerIdQueryVariables>;
export const GetWebEnrollmentsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetWebEnrollments"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"search"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"processed"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"searchName"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"searchEmail"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"searchMobile"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"searchNmi"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"searchTariff"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"searchAddress"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"searchPortal"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"searchVpp"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"branchTenant"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"searchCompanyName"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"webEnrollments"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"search"},"value":{"kind":"Variable","name":{"kind":"Name","value":"search"}}},{"kind":"Argument","name":{"kind":"Name","value":"processed"},"value":{"kind":"Variable","name":{"kind":"Name","value":"processed"}}},{"kind":"Argument","name":{"kind":"Name","value":"searchName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchName"}}},{"kind":"Argument","name":{"kind":"Name","value":"searchEmail"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchEmail"}}},{"kind":"Argument","name":{"kind":"Name","value":"searchMobile"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchMobile"}}},{"kind":"Argument","name":{"kind":"Name","value":"searchNmi"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchNmi"}}},{"kind":"Argument","name":{"kind":"Name","value":"searchTariff"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchTariff"}}},{"kind":"Argument","name":{"kind":"Name","value":"searchAddress"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchAddress"}}},{"kind":"Argument","name":{"kind":"Name","value":"searchPortal"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchPortal"}}},{"kind":"Argument","name":{"kind":"Name","value":"searchVpp"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchVpp"}}},{"kind":"Argument","name":{"kind":"Name","value":"branchTenant"},"value":{"kind":"Variable","name":{"kind":"Name","value":"branchTenant"}}},{"kind":"Argument","name":{"kind":"Name","value":"searchCompanyName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchCompanyName"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"payload"}},{"kind":"Field","name":{"kind":"Name","value":"processed"}},{"kind":"Field","name":{"kind":"Name","value":"isConsentRead"}},{"kind":"Field","name":{"kind":"Name","value":"medicareIrn"}},{"kind":"Field","name":{"kind":"Name","value":"medicareCardType"}},{"kind":"Field","name":{"kind":"Name","value":"isEnrollmentFinished"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"meta"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalRecords"}},{"kind":"Field","name":{"kind":"Name","value":"currentPage"}},{"kind":"Field","name":{"kind":"Name","value":"totalPages"}},{"kind":"Field","name":{"kind":"Name","value":"recordsPerPage"}}]}}]}}]}}]} as unknown as DocumentNode<GetWebEnrollmentsQuery, GetWebEnrollmentsQueryVariables>;
export const GetPeerlessCompanyNamesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPeerlessCompanyNames"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"peerlessCompanyNames"}}]}}]} as unknown as DocumentNode<GetPeerlessCompanyNamesQuery, GetPeerlessCompanyNamesQueryVariables>;
export const GetWebEnrollmentByUidDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetWebEnrollmentByUid"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"webEnrollmentByUid"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uid"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"payload"}},{"kind":"Field","name":{"kind":"Name","value":"isConsentRead"}},{"kind":"Field","name":{"kind":"Name","value":"medicareIrn"}},{"kind":"Field","name":{"kind":"Name","value":"medicareCardType"}},{"kind":"Field","name":{"kind":"Name","value":"isEnrollmentFinished"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]} as unknown as DocumentNode<GetWebEnrollmentByUidQuery, GetWebEnrollmentByUidQueryVariables>;
export const GetCustomerDashboardDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCustomerDashboard"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"customerDashboard"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"utilmateStatusSummary"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"customers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"customerId"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"utilmateStatus"}},{"kind":"Field","name":{"kind":"Name","value":"vppConnected"}},{"kind":"Field","name":{"kind":"Name","value":"vpp"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"signedStatusSummary"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"customers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"customerId"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"vppPendingSummary"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"customers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"customerId"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"vppConnected"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetCustomerDashboardQuery, GetCustomerDashboardQueryVariables>;
export const GetMonthlyEnrollmentsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMonthlyEnrollments"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"months"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"monthlyEnrollments"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"months"},"value":{"kind":"Variable","name":{"kind":"Name","value":"months"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"month"}},{"kind":"Field","name":{"kind":"Name","value":"year"}},{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]} as unknown as DocumentNode<GetMonthlyEnrollmentsQuery, GetMonthlyEnrollmentsQueryVariables>;
export const GetLeadSourceDistributionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetLeadSourceDistribution"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"leadSourceDistribution"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"source"}},{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"percentage"}}]}}]}}]} as unknown as DocumentNode<GetLeadSourceDistributionQuery, GetLeadSourceDistributionQueryVariables>;
export const GetAllEmailLogsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAllEmailLogs"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"search"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"status"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"emailType"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"allEmailLogs"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"search"},"value":{"kind":"Variable","name":{"kind":"Name","value":"search"}}},{"kind":"Argument","name":{"kind":"Name","value":"status"},"value":{"kind":"Variable","name":{"kind":"Name","value":"status"}}},{"kind":"Argument","name":{"kind":"Name","value":"emailType"},"value":{"kind":"Variable","name":{"kind":"Name","value":"emailType"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"meta"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalRecords"}},{"kind":"Field","name":{"kind":"Name","value":"currentPage"}},{"kind":"Field","name":{"kind":"Name","value":"totalPages"}},{"kind":"Field","name":{"kind":"Name","value":"recordsPerPage"}}]}},{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"customerUid"}},{"kind":"Field","name":{"kind":"Name","value":"customerId"}},{"kind":"Field","name":{"kind":"Name","value":"emailTo"}},{"kind":"Field","name":{"kind":"Name","value":"emailType"}},{"kind":"Field","name":{"kind":"Name","value":"subject"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"errorMessage"}},{"kind":"Field","name":{"kind":"Name","value":"sentAt"}},{"kind":"Field","name":{"kind":"Name","value":"verifiedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"}},{"kind":"Field","name":{"kind":"Name","value":"tenant"}},{"kind":"Field","name":{"kind":"Name","value":"verificationCode"}},{"kind":"Field","name":{"kind":"Name","value":"attachments"}}]}}]}}]}}]} as unknown as DocumentNode<GetAllEmailLogsQuery, GetAllEmailLogsQueryVariables>;
export const GetCustomerEmailLogsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCustomerEmailLogs"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"customerUid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"customerEmailLogs"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"customerUid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"customerUid"}}},{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"meta"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalRecords"}},{"kind":"Field","name":{"kind":"Name","value":"currentPage"}},{"kind":"Field","name":{"kind":"Name","value":"totalPages"}},{"kind":"Field","name":{"kind":"Name","value":"recordsPerPage"}}]}},{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"customerUid"}},{"kind":"Field","name":{"kind":"Name","value":"customerId"}},{"kind":"Field","name":{"kind":"Name","value":"emailTo"}},{"kind":"Field","name":{"kind":"Name","value":"emailType"}},{"kind":"Field","name":{"kind":"Name","value":"subject"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"errorMessage"}},{"kind":"Field","name":{"kind":"Name","value":"sentAt"}},{"kind":"Field","name":{"kind":"Name","value":"verifiedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"}},{"kind":"Field","name":{"kind":"Name","value":"tenant"}},{"kind":"Field","name":{"kind":"Name","value":"verificationCode"}},{"kind":"Field","name":{"kind":"Name","value":"attachments"}}]}}]}}]}}]} as unknown as DocumentNode<GetCustomerEmailLogsQuery, GetCustomerEmailLogsQueryVariables>;
export const GetAllEmailSettingsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAllEmailSettings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"emailSettings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"eventType"}},{"kind":"Field","name":{"kind":"Name","value":"templateUid"}},{"kind":"Field","name":{"kind":"Name","value":"template"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}}]}}]}}]} as unknown as DocumentNode<GetAllEmailSettingsQuery, GetAllEmailSettingsQueryVariables>;
export const UpdateEmailSettingDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateEmailSetting"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"eventType"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"templateUid"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateEmailSetting"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"eventType"},"value":{"kind":"Variable","name":{"kind":"Name","value":"eventType"}}},{"kind":"Argument","name":{"kind":"Name","value":"templateUid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"templateUid"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"eventType"}},{"kind":"Field","name":{"kind":"Name","value":"templateUid"}},{"kind":"Field","name":{"kind":"Name","value":"template"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}}]}}]}}]} as unknown as DocumentNode<UpdateEmailSettingMutation, UpdateEmailSettingMutationVariables>;
export const GetEmailTemplatesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetEmailTemplates"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"status"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"entityType"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"emailTemplates"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"status"},"value":{"kind":"Variable","name":{"kind":"Name","value":"status"}}},{"kind":"Argument","name":{"kind":"Name","value":"entityType"},"value":{"kind":"Variable","name":{"kind":"Name","value":"entityType"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"subject"}},{"kind":"Field","name":{"kind":"Name","value":"entityType"}},{"kind":"Field","name":{"kind":"Name","value":"announcementUid"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"meta"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalRecords"}},{"kind":"Field","name":{"kind":"Name","value":"currentPage"}},{"kind":"Field","name":{"kind":"Name","value":"totalPages"}},{"kind":"Field","name":{"kind":"Name","value":"recordsPerPage"}}]}}]}}]}}]} as unknown as DocumentNode<GetEmailTemplatesQuery, GetEmailTemplatesQueryVariables>;
export const GetEmailTemplateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetEmailTemplate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"emailTemplate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uid"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"entityType"}},{"kind":"Field","name":{"kind":"Name","value":"subject"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"announcementUid"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<GetEmailTemplateQuery, GetEmailTemplateQueryVariables>;
export const PreviewSystemTemplateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PreviewSystemTemplate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"eventType"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"isWithoutSignature"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"previewSystemTemplate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"eventType"},"value":{"kind":"Variable","name":{"kind":"Name","value":"eventType"}}},{"kind":"Argument","name":{"kind":"Name","value":"isWithoutSignature"},"value":{"kind":"Variable","name":{"kind":"Name","value":"isWithoutSignature"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"subject"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"isCustom"}}]}}]}}]} as unknown as DocumentNode<PreviewSystemTemplateQuery, PreviewSystemTemplateQueryVariables>;
export const GetAnnouncementsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAnnouncements"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"announcements"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"fileName"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]} as unknown as DocumentNode<GetAnnouncementsQuery, GetAnnouncementsQueryVariables>;
export const GetInverterMakesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetInverterMakes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"inverterMakes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"make"}},{"kind":"Field","name":{"kind":"Name","value":"shortName"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"minCapacity"}},{"kind":"Field","name":{"kind":"Name","value":"maxCapacity"}},{"kind":"Field","name":{"kind":"Name","value":"totalCapacity"}},{"kind":"Field","name":{"kind":"Name","value":"usableCapacity"}},{"kind":"Field","name":{"kind":"Name","value":"warrantyDetails"}},{"kind":"Field","name":{"kind":"Name","value":"productStatus"}},{"kind":"Field","name":{"kind":"Name","value":"cecCapacity"}},{"kind":"Field","name":{"kind":"Name","value":"cecExpiryDate"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"datasheetPath"}},{"kind":"Field","name":{"kind":"Name","value":"datasheetUrl"}},{"kind":"Field","name":{"kind":"Name","value":"datasheetName"}}]}}]}}]} as unknown as DocumentNode<GetInverterMakesQuery, GetInverterMakesQueryVariables>;
export const GetInverterModelsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetInverterModels"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"makeUid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"inverterModels"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"makeUid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"makeUid"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"model"}},{"kind":"Field","name":{"kind":"Name","value":"capacity"}},{"kind":"Field","name":{"kind":"Name","value":"warranty"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}}]}}]}}]} as unknown as DocumentNode<GetInverterModelsQuery, GetInverterModelsQueryVariables>;
export const GetLeadsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetLeads"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"search"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"source"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"isCustomerNow"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"customerStatus"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"searchAssignedTo"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"searchCreatedBy"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"branchTenant"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"leads"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"search"},"value":{"kind":"Variable","name":{"kind":"Name","value":"search"}}},{"kind":"Argument","name":{"kind":"Name","value":"source"},"value":{"kind":"Variable","name":{"kind":"Name","value":"source"}}},{"kind":"Argument","name":{"kind":"Name","value":"isCustomerNow"},"value":{"kind":"Variable","name":{"kind":"Name","value":"isCustomerNow"}}},{"kind":"Argument","name":{"kind":"Name","value":"customerStatus"},"value":{"kind":"Variable","name":{"kind":"Name","value":"customerStatus"}}},{"kind":"Argument","name":{"kind":"Name","value":"searchAssignedTo"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchAssignedTo"}}},{"kind":"Argument","name":{"kind":"Name","value":"searchCreatedBy"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchCreatedBy"}}},{"kind":"Argument","name":{"kind":"Name","value":"branchTenant"},"value":{"kind":"Variable","name":{"kind":"Name","value":"branchTenant"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"LeadFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"meta"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalRecords"}},{"kind":"Field","name":{"kind":"Name","value":"currentPage"}},{"kind":"Field","name":{"kind":"Name","value":"totalPages"}},{"kind":"Field","name":{"kind":"Name","value":"recordsPerPage"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"LeadFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Lead"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"firstname"}},{"kind":"Field","name":{"kind":"Name","value":"lastname"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"source"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"unitnumber"}},{"kind":"Field","name":{"kind":"Name","value":"flatorunittype"}},{"kind":"Field","name":{"kind":"Name","value":"gnafpid"}},{"kind":"Field","name":{"kind":"Name","value":"housenumber"}},{"kind":"Field","name":{"kind":"Name","value":"buildingname"}},{"kind":"Field","name":{"kind":"Name","value":"floorlevelnumber"}},{"kind":"Field","name":{"kind":"Name","value":"streetnumber"}},{"kind":"Field","name":{"kind":"Name","value":"streetname"}},{"kind":"Field","name":{"kind":"Name","value":"streettype"}},{"kind":"Field","name":{"kind":"Name","value":"suburb"}},{"kind":"Field","name":{"kind":"Name","value":"postcode"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"nmi"}},{"kind":"Field","name":{"kind":"Name","value":"fullAddress"}},{"kind":"Field","name":{"kind":"Name","value":"referralName"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"assignedTo"}},{"kind":"Field","name":{"kind":"Name","value":"assignedToUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdByUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"branchTenant"}},{"kind":"Field","name":{"kind":"Name","value":"customerUid"}},{"kind":"Field","name":{"kind":"Name","value":"isCustomerNow"}},{"kind":"Field","name":{"kind":"Name","value":"customer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"status"}}]}},{"kind":"Field","name":{"kind":"Name","value":"isDuplicate"}}]}}]} as unknown as DocumentNode<GetLeadsQuery, GetLeadsQueryVariables>;
export const GetLeadDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetLead"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"lead"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uid"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"LeadFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"LeadFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Lead"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"firstname"}},{"kind":"Field","name":{"kind":"Name","value":"lastname"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"source"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"unitnumber"}},{"kind":"Field","name":{"kind":"Name","value":"flatorunittype"}},{"kind":"Field","name":{"kind":"Name","value":"gnafpid"}},{"kind":"Field","name":{"kind":"Name","value":"housenumber"}},{"kind":"Field","name":{"kind":"Name","value":"buildingname"}},{"kind":"Field","name":{"kind":"Name","value":"floorlevelnumber"}},{"kind":"Field","name":{"kind":"Name","value":"streetnumber"}},{"kind":"Field","name":{"kind":"Name","value":"streetname"}},{"kind":"Field","name":{"kind":"Name","value":"streettype"}},{"kind":"Field","name":{"kind":"Name","value":"suburb"}},{"kind":"Field","name":{"kind":"Name","value":"postcode"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"nmi"}},{"kind":"Field","name":{"kind":"Name","value":"fullAddress"}},{"kind":"Field","name":{"kind":"Name","value":"referralName"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"assignedTo"}},{"kind":"Field","name":{"kind":"Name","value":"assignedToUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdByUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"branchTenant"}},{"kind":"Field","name":{"kind":"Name","value":"customerUid"}},{"kind":"Field","name":{"kind":"Name","value":"isCustomerNow"}},{"kind":"Field","name":{"kind":"Name","value":"customer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"status"}}]}},{"kind":"Field","name":{"kind":"Name","value":"isDuplicate"}}]}}]} as unknown as DocumentNode<GetLeadQuery, GetLeadQueryVariables>;
export const GetLeadSourcesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetLeadSources"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"leadSources"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}}]}}]}}]} as unknown as DocumentNode<GetLeadSourcesQuery, GetLeadSourcesQueryVariables>;
export const CheckLeadDuplicateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CheckLeadDuplicate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"number"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"address"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"CustomerAddressInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"checkLeadDuplicate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"number"},"value":{"kind":"Variable","name":{"kind":"Name","value":"number"}}},{"kind":"Argument","name":{"kind":"Name","value":"address"},"value":{"kind":"Variable","name":{"kind":"Name","value":"address"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"firstname"}},{"kind":"Field","name":{"kind":"Name","value":"lastname"}},{"kind":"Field","name":{"kind":"Name","value":"isDuplicate"}}]}}]}}]} as unknown as DocumentNode<CheckLeadDuplicateQuery, CheckLeadDuplicateQueryVariables>;
export const GetCustomerMaintenanceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCustomerMaintenance"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"customerUid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"customerMaintenance"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"customerUid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"customerUid"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"customerUid"}},{"kind":"Field","name":{"kind":"Name","value":"callDate"}},{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"takenCareByUid"}},{"kind":"Field","name":{"kind":"Name","value":"takenCareByUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"method"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"priority"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdByName"}}]}}]}}]} as unknown as DocumentNode<GetCustomerMaintenanceQuery, GetCustomerMaintenanceQueryVariables>;
export const GetMaintenanceRecordDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMaintenanceRecord"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"maintenanceRecord"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uid"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"customerUid"}},{"kind":"Field","name":{"kind":"Name","value":"callDate"}},{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"takenCareByUid"}},{"kind":"Field","name":{"kind":"Name","value":"method"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"priority"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}}]}}]}}]} as unknown as DocumentNode<GetMaintenanceRecordQuery, GetMaintenanceRecordQueryVariables>;
export const GetItemCategoriesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetItemCategories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"itemCategories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"color"}}]}}]}}]} as unknown as DocumentNode<GetItemCategoriesQuery, GetItemCategoriesQueryVariables>;
export const GetMaintenancesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMaintenances"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"status"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"priority"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"category"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"search"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"maintenances"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"status"},"value":{"kind":"Variable","name":{"kind":"Name","value":"status"}}},{"kind":"Argument","name":{"kind":"Name","value":"priority"},"value":{"kind":"Variable","name":{"kind":"Name","value":"priority"}}},{"kind":"Argument","name":{"kind":"Name","value":"category"},"value":{"kind":"Variable","name":{"kind":"Name","value":"category"}}},{"kind":"Argument","name":{"kind":"Name","value":"search"},"value":{"kind":"Variable","name":{"kind":"Name","value":"search"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"customerUid"}},{"kind":"Field","name":{"kind":"Name","value":"customer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"customerId"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"number"}}]}},{"kind":"Field","name":{"kind":"Name","value":"callDate"}},{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"takenCareByUid"}},{"kind":"Field","name":{"kind":"Name","value":"takenCareByUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"method"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"priority"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdByName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"meta"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalRecords"}},{"kind":"Field","name":{"kind":"Name","value":"currentPage"}},{"kind":"Field","name":{"kind":"Name","value":"totalPages"}},{"kind":"Field","name":{"kind":"Name","value":"recordsPerPage"}}]}}]}}]}}]} as unknown as DocumentNode<GetMaintenancesQuery, GetMaintenancesQueryVariables>;
export const GetMaintenanceStatsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMaintenanceStats"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"maintenanceStats"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"inProgress"}},{"kind":"Field","name":{"kind":"Name","value":"resolved"}},{"kind":"Field","name":{"kind":"Name","value":"cancelled"}}]}}]}}]} as unknown as DocumentNode<GetMaintenanceStatsQuery, GetMaintenanceStatsQueryVariables>;
export const GetMenusDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMenus"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"menus"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"parentUid"}}]}},{"kind":"Field","name":{"kind":"Name","value":"meta"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalRecords"}}]}}]}}]}}]} as unknown as DocumentNode<GetMenusQuery, GetMenusQueryVariables>;
export const GetFeaturesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetFeatures"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"menuUid"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"features"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"menuUid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"menuUid"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"menuUid"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}}]}}]}}]} as unknown as DocumentNode<GetFeaturesQuery, GetFeaturesQueryVariables>;
export const GetCustomerNotesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCustomerNotes"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"customerUid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"maintenanceUid"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"customerNotes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"customerUid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"customerUid"}}},{"kind":"Argument","name":{"kind":"Name","value":"maintenanceUid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"maintenanceUid"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"customerUid"}},{"kind":"Field","name":{"kind":"Name","value":"maintenanceUid"}},{"kind":"Field","name":{"kind":"Name","value":"userUid"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"followUp"}},{"kind":"Field","name":{"kind":"Name","value":"assignedTo"}},{"kind":"Field","name":{"kind":"Name","value":"assignedToUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"noteTypeDetails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"color"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdByName"}}]}}]}}]} as unknown as DocumentNode<GetCustomerNotesQuery, GetCustomerNotesQueryVariables>;
export const GetNoteTypesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetNoteTypes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"noteTypes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"}}]}}]}}]} as unknown as DocumentNode<GetNoteTypesQuery, GetNoteTypesQueryVariables>;
export const GetNotificationEntitiesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetNotificationEntities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notificationEntities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"tenant"}},{"kind":"Field","name":{"kind":"Name","value":"fromEmail"}},{"kind":"Field","name":{"kind":"Name","value":"bccEmail"}},{"kind":"Field","name":{"kind":"Name","value":"preference"}},{"kind":"Field","name":{"kind":"Name","value":"entityType"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"userUids"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<GetNotificationEntitiesQuery, GetNotificationEntitiesQueryVariables>;
export const GetNotificationEntityDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetNotificationEntity"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notificationEntity"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uid"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"tenant"}},{"kind":"Field","name":{"kind":"Name","value":"fromEmail"}},{"kind":"Field","name":{"kind":"Name","value":"bccEmail"}},{"kind":"Field","name":{"kind":"Name","value":"preference"}},{"kind":"Field","name":{"kind":"Name","value":"entityType"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"userUids"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<GetNotificationEntityQuery, GetNotificationEntityQueryVariables>;
export const GetPdfTermsListDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPdfTermsList"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pdfTermsList"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"rateType"}},{"kind":"Field","name":{"kind":"Name","value":"rateUids"}},{"kind":"Field","name":{"kind":"Name","value":"planUids"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"meta"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalRecords"}},{"kind":"Field","name":{"kind":"Name","value":"currentPage"}},{"kind":"Field","name":{"kind":"Name","value":"totalPages"}},{"kind":"Field","name":{"kind":"Name","value":"recordsPerPage"}}]}}]}}]}}]} as unknown as DocumentNode<GetPdfTermsListQuery, GetPdfTermsListQueryVariables>;
export const GetPdfTermDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPdfTerm"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pdfTerm"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uid"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"rateType"}},{"kind":"Field","name":{"kind":"Name","value":"rateUids"}},{"kind":"Field","name":{"kind":"Name","value":"planUids"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<GetPdfTermQuery, GetPdfTermQueryVariables>;
export const GetRolePermissionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetRolePermissions"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"roleUid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"rolePermissions"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"roleUid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"roleUid"}}},{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"roleUid"}},{"kind":"Field","name":{"kind":"Name","value":"menuUid"}},{"kind":"Field","name":{"kind":"Name","value":"canView"}},{"kind":"Field","name":{"kind":"Name","value":"canCreate"}},{"kind":"Field","name":{"kind":"Name","value":"canEdit"}},{"kind":"Field","name":{"kind":"Name","value":"canDelete"}}]}}]}}]}}]} as unknown as DocumentNode<GetRolePermissionsQuery, GetRolePermissionsQueryVariables>;
export const GetRoleFeaturePermissionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetRoleFeaturePermissions"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"roleUid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"roleFeaturePermissions"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"roleUid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"roleUid"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"roleUid"}},{"kind":"Field","name":{"kind":"Name","value":"featureUid"}},{"kind":"Field","name":{"kind":"Name","value":"isEnabled"}}]}}]}}]} as unknown as DocumentNode<GetRoleFeaturePermissionsQuery, GetRoleFeaturePermissionsQueryVariables>;
export const GetPlansDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPlans"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"plans"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"tenant"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"discount"}},{"kind":"Field","name":{"kind":"Name","value":"propertyType"}},{"kind":"Field","name":{"kind":"Name","value":"isSolarRequired"}},{"kind":"Field","name":{"kind":"Name","value":"isBatteryRequired"}},{"kind":"Field","name":{"kind":"Name","value":"contractTerm"}},{"kind":"Field","name":{"kind":"Name","value":"exitFee"}},{"kind":"Field","name":{"kind":"Name","value":"ratesJson"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"bonusUids"}}]}}]}}]} as unknown as DocumentNode<GetPlansQuery, GetPlansQueryVariables>;
export const GetActivePlansDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetActivePlans"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"activePlans"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"tenant"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"discount"}},{"kind":"Field","name":{"kind":"Name","value":"propertyType"}},{"kind":"Field","name":{"kind":"Name","value":"isSolarRequired"}},{"kind":"Field","name":{"kind":"Name","value":"isBatteryRequired"}},{"kind":"Field","name":{"kind":"Name","value":"contractTerm"}},{"kind":"Field","name":{"kind":"Name","value":"exitFee"}},{"kind":"Field","name":{"kind":"Name","value":"ratesJson"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"bonusUids"}}]}}]}}]} as unknown as DocumentNode<GetActivePlansQuery, GetActivePlansQueryVariables>;
export const GetPlanDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPlan"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"plan"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uid"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"tenant"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"discount"}},{"kind":"Field","name":{"kind":"Name","value":"propertyType"}},{"kind":"Field","name":{"kind":"Name","value":"isSolarRequired"}},{"kind":"Field","name":{"kind":"Name","value":"isBatteryRequired"}},{"kind":"Field","name":{"kind":"Name","value":"contractTerm"}},{"kind":"Field","name":{"kind":"Name","value":"exitFee"}},{"kind":"Field","name":{"kind":"Name","value":"ratesJson"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"bonusUids"}}]}}]}}]} as unknown as DocumentNode<GetPlanQuery, GetPlanQueryVariables>;
export const RatePlansDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"RatePlans"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"search"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"state"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"dnsp"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"type"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ratePlans"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"search"},"value":{"kind":"Variable","name":{"kind":"Name","value":"search"}}},{"kind":"Argument","name":{"kind":"Name","value":"state"},"value":{"kind":"Variable","name":{"kind":"Name","value":"state"}}},{"kind":"Argument","name":{"kind":"Name","value":"dnsp"},"value":{"kind":"Variable","name":{"kind":"Name","value":"dnsp"}}},{"kind":"Argument","name":{"kind":"Name","value":"type"},"value":{"kind":"Variable","name":{"kind":"Name","value":"type"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"tenant"}},{"kind":"Field","name":{"kind":"Name","value":"codes"}},{"kind":"Field","name":{"kind":"Name","value":"planId"}},{"kind":"Field","name":{"kind":"Name","value":"dnsp"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"tariff"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"vpp"}},{"kind":"Field","name":{"kind":"Name","value":"discountApplies"}},{"kind":"Field","name":{"kind":"Name","value":"discountPercentage"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"}},{"kind":"Field","name":{"kind":"Name","value":"updatedBy"}},{"kind":"Field","name":{"kind":"Name","value":"deletedBy"}},{"kind":"Field","name":{"kind":"Name","value":"offers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"ratePlanUid"}},{"kind":"Field","name":{"kind":"Name","value":"tenant"}},{"kind":"Field","name":{"kind":"Name","value":"offerName"}},{"kind":"Field","name":{"kind":"Name","value":"anytime"}},{"kind":"Field","name":{"kind":"Name","value":"cl1Supply"}},{"kind":"Field","name":{"kind":"Name","value":"cl1Usage"}},{"kind":"Field","name":{"kind":"Name","value":"cl2Supply"}},{"kind":"Field","name":{"kind":"Name","value":"cl2Usage"}},{"kind":"Field","name":{"kind":"Name","value":"demand"}},{"kind":"Field","name":{"kind":"Name","value":"demandOp"}},{"kind":"Field","name":{"kind":"Name","value":"demandP"}},{"kind":"Field","name":{"kind":"Name","value":"demandS"}},{"kind":"Field","name":{"kind":"Name","value":"fit"}},{"kind":"Field","name":{"kind":"Name","value":"fitPeak"}},{"kind":"Field","name":{"kind":"Name","value":"fitCritical"}},{"kind":"Field","name":{"kind":"Name","value":"fitVpp"}},{"kind":"Field","name":{"kind":"Name","value":"offPeak"}},{"kind":"Field","name":{"kind":"Name","value":"peak"}},{"kind":"Field","name":{"kind":"Name","value":"shoulder"}},{"kind":"Field","name":{"kind":"Name","value":"supplyCharge"}},{"kind":"Field","name":{"kind":"Name","value":"vppOrcharge"}},{"kind":"Field","name":{"kind":"Name","value":"dynamicRates"}},{"kind":"Field","name":{"kind":"Name","value":"priceUnits"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"}},{"kind":"Field","name":{"kind":"Name","value":"updatedBy"}},{"kind":"Field","name":{"kind":"Name","value":"deletedBy"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"meta"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalRecords"}},{"kind":"Field","name":{"kind":"Name","value":"currentPage"}},{"kind":"Field","name":{"kind":"Name","value":"totalPages"}},{"kind":"Field","name":{"kind":"Name","value":"recordsPerPage"}}]}}]}}]}}]} as unknown as DocumentNode<RatePlansQuery, RatePlansQueryVariables>;
export const RatesHistoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"RatesHistory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"ratePlanUid"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"auditAction"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ratesHistory"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"ratePlanUid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ratePlanUid"}}},{"kind":"Argument","name":{"kind":"Name","value":"auditAction"},"value":{"kind":"Variable","name":{"kind":"Name","value":"auditAction"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"version"}},{"kind":"Field","name":{"kind":"Name","value":"ratePlanUid"}},{"kind":"Field","name":{"kind":"Name","value":"auditAction"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"}},{"kind":"Field","name":{"kind":"Name","value":"createdByName"}},{"kind":"Field","name":{"kind":"Name","value":"activeVersion"}},{"kind":"Field","name":{"kind":"Name","value":"newRecord"}}]}},{"kind":"Field","name":{"kind":"Name","value":"meta"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalRecords"}},{"kind":"Field","name":{"kind":"Name","value":"currentPage"}},{"kind":"Field","name":{"kind":"Name","value":"totalPages"}},{"kind":"Field","name":{"kind":"Name","value":"recordsPerPage"}}]}}]}}]}}]} as unknown as DocumentNode<RatesHistoryQuery, RatesHistoryQueryVariables>;
export const HistoryDetailsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"HistoryDetails"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ratesHistoryRecord"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uid"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"newRecord"}},{"kind":"Field","name":{"kind":"Name","value":"oldRecord"}}]}}]}}]} as unknown as DocumentNode<HistoryDetailsQuery, HistoryDetailsQueryVariables>;
export const GlobalActiveRatesHistoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GlobalActiveRatesHistory"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"globalActiveRatesHistory"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"version"}},{"kind":"Field","name":{"kind":"Name","value":"newRecord"}},{"kind":"Field","name":{"kind":"Name","value":"activeVersion"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdByName"}}]}}]}}]} as unknown as DocumentNode<GlobalActiveRatesHistoryQuery, GlobalActiveRatesHistoryQueryVariables>;
export const HasRatesChangesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"HasRatesChanges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasRatesChanges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasChanges"}},{"kind":"Field","name":{"kind":"Name","value":"changedRatePlanUids"}},{"kind":"Field","name":{"kind":"Name","value":"changes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"newRecord"}},{"kind":"Field","name":{"kind":"Name","value":"oldRecord"}}]}}]}}]}}]} as unknown as DocumentNode<HasRatesChangesQuery, HasRatesChangesQueryVariables>;
export const RatesHistoryByVersionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"RatesHistoryByVersion"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"version"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ratesHistoryByVersion"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"version"},"value":{"kind":"Variable","name":{"kind":"Name","value":"version"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"version"}},{"kind":"Field","name":{"kind":"Name","value":"newRecord"}},{"kind":"Field","name":{"kind":"Name","value":"activeVersion"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]} as unknown as DocumentNode<RatesHistoryByVersionQuery, RatesHistoryByVersionQueryVariables>;
export const MeasurementUnitsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MeasurementUnits"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"measurementUnits"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<MeasurementUnitsQuery, MeasurementUnitsQueryVariables>;
export const GetRatePlanByCodeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetRatePlanByCode"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"code"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ratePlanByCode"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"code"},"value":{"kind":"Variable","name":{"kind":"Name","value":"code"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"codes"}},{"kind":"Field","name":{"kind":"Name","value":"planId"}},{"kind":"Field","name":{"kind":"Name","value":"dnsp"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"tariff"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"offers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"offerName"}},{"kind":"Field","name":{"kind":"Name","value":"anytime"}},{"kind":"Field","name":{"kind":"Name","value":"cl1Supply"}},{"kind":"Field","name":{"kind":"Name","value":"cl1Usage"}},{"kind":"Field","name":{"kind":"Name","value":"cl2Supply"}},{"kind":"Field","name":{"kind":"Name","value":"cl2Usage"}},{"kind":"Field","name":{"kind":"Name","value":"demand"}},{"kind":"Field","name":{"kind":"Name","value":"demandOp"}},{"kind":"Field","name":{"kind":"Name","value":"demandP"}},{"kind":"Field","name":{"kind":"Name","value":"demandS"}},{"kind":"Field","name":{"kind":"Name","value":"fit"}},{"kind":"Field","name":{"kind":"Name","value":"fitPeak"}},{"kind":"Field","name":{"kind":"Name","value":"fitCritical"}},{"kind":"Field","name":{"kind":"Name","value":"fitVpp"}},{"kind":"Field","name":{"kind":"Name","value":"offPeak"}},{"kind":"Field","name":{"kind":"Name","value":"peak"}},{"kind":"Field","name":{"kind":"Name","value":"shoulder"}},{"kind":"Field","name":{"kind":"Name","value":"supplyCharge"}},{"kind":"Field","name":{"kind":"Name","value":"vppOrcharge"}},{"kind":"Field","name":{"kind":"Name","value":"dynamicRates"}},{"kind":"Field","name":{"kind":"Name","value":"priceUnits"}}]}}]}}]}}]} as unknown as DocumentNode<GetRatePlanByCodeQuery, GetRatePlanByCodeQueryVariables>;
export const GetRolesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetRoles"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"isVisibleInLists"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"roles"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"isVisibleInLists"},"value":{"kind":"Variable","name":{"kind":"Name","value":"isVisibleInLists"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"isIndependentUi"}},{"kind":"Field","name":{"kind":"Name","value":"isVisibleInLists"}}]}},{"kind":"Field","name":{"kind":"Name","value":"meta"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalRecords"}},{"kind":"Field","name":{"kind":"Name","value":"currentPage"}},{"kind":"Field","name":{"kind":"Name","value":"totalPages"}},{"kind":"Field","name":{"kind":"Name","value":"recordsPerPage"}}]}}]}}]}}]} as unknown as DocumentNode<GetRolesQuery, GetRolesQueryVariables>;
export const GetUserPermissionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUserPermissions"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userUid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userPermissions"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userUid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userUid"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userUid"}},{"kind":"Field","name":{"kind":"Name","value":"menuUid"}},{"kind":"Field","name":{"kind":"Name","value":"canView"}},{"kind":"Field","name":{"kind":"Name","value":"canCreate"}},{"kind":"Field","name":{"kind":"Name","value":"canEdit"}},{"kind":"Field","name":{"kind":"Name","value":"canDelete"}}]}}]}}]} as unknown as DocumentNode<GetUserPermissionsQuery, GetUserPermissionsQueryVariables>;
export const GetUserFeaturePermissionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUserFeaturePermissions"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userUid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userFeaturePermissions"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userUid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userUid"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userUid"}},{"kind":"Field","name":{"kind":"Name","value":"featureUid"}},{"kind":"Field","name":{"kind":"Name","value":"isEnabled"}}]}}]}}]} as unknown as DocumentNode<GetUserFeaturePermissionsQuery, GetUserFeaturePermissionsQueryVariables>;
export const GetUsersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUsers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"status"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"search"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"roleUid"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"onlyVisibleRoles"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"topLevelOnly"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"branchTenant"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"users"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"status"},"value":{"kind":"Variable","name":{"kind":"Name","value":"status"}}},{"kind":"Argument","name":{"kind":"Name","value":"search"},"value":{"kind":"Variable","name":{"kind":"Name","value":"search"}}},{"kind":"Argument","name":{"kind":"Name","value":"roleUid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"roleUid"}}},{"kind":"Argument","name":{"kind":"Name","value":"onlyVisibleRoles"},"value":{"kind":"Variable","name":{"kind":"Name","value":"onlyVisibleRoles"}}},{"kind":"Argument","name":{"kind":"Name","value":"topLevelOnly"},"value":{"kind":"Variable","name":{"kind":"Name","value":"topLevelOnly"}}},{"kind":"Argument","name":{"kind":"Name","value":"branchTenant"},"value":{"kind":"Variable","name":{"kind":"Name","value":"branchTenant"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"meta"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalRecords"}},{"kind":"Field","name":{"kind":"Name","value":"currentPage"}},{"kind":"Field","name":{"kind":"Name","value":"totalPages"}},{"kind":"Field","name":{"kind":"Name","value":"recordsPerPage"}}]}},{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"tenant"}},{"kind":"Field","name":{"kind":"Name","value":"roleUid"}},{"kind":"Field","name":{"kind":"Name","value":"roleName"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"isMaster"}},{"kind":"Field","name":{"kind":"Name","value":"branchTenant"}}]}}]}}]}}]} as unknown as DocumentNode<GetUsersQuery, GetUsersQueryVariables>;
export const GetUserByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUserById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uid"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"tenant"}},{"kind":"Field","name":{"kind":"Name","value":"roleUid"}},{"kind":"Field","name":{"kind":"Name","value":"roleName"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"ipAddress"}},{"kind":"Field","name":{"kind":"Name","value":"isAllowedWithoutIp"}},{"kind":"Field","name":{"kind":"Name","value":"isMaster"}}]}}]}}]} as unknown as DocumentNode<GetUserByIdQuery, GetUserByIdQueryVariables>;
export const GetGsyncStatsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetGsyncStats"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"searchSigned"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"total"},"name":{"kind":"Name","value":"customersCursor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"1"}},{"kind":"Argument","name":{"kind":"Name","value":"searchVpp"},"value":{"kind":"IntValue","value":"1"}},{"kind":"Argument","name":{"kind":"Name","value":"searchSigned"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchSigned"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalCount"}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"connected"},"name":{"kind":"Name","value":"customersCursor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"1"}},{"kind":"Argument","name":{"kind":"Name","value":"searchVpp"},"value":{"kind":"IntValue","value":"1"}},{"kind":"Argument","name":{"kind":"Name","value":"searchVppConnected"},"value":{"kind":"IntValue","value":"1"}},{"kind":"Argument","name":{"kind":"Name","value":"searchVppApiPushed"},"value":{"kind":"IntValue","value":"1"}},{"kind":"Argument","name":{"kind":"Name","value":"searchSigned"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchSigned"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalCount"}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"skipConnect"},"name":{"kind":"Name","value":"customersCursor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"1"}},{"kind":"Argument","name":{"kind":"Name","value":"searchVpp"},"value":{"kind":"IntValue","value":"1"}},{"kind":"Argument","name":{"kind":"Name","value":"searchVppConnected"},"value":{"kind":"IntValue","value":"1"}},{"kind":"Argument","name":{"kind":"Name","value":"searchVppApiPushed"},"value":{"kind":"IntValue","value":"0"}},{"kind":"Argument","name":{"kind":"Name","value":"searchSigned"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchSigned"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalCount"}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"pending"},"name":{"kind":"Name","value":"customersCursor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"1"}},{"kind":"Argument","name":{"kind":"Name","value":"searchVpp"},"value":{"kind":"IntValue","value":"1"}},{"kind":"Argument","name":{"kind":"Name","value":"searchVppConnected"},"value":{"kind":"IntValue","value":"0"}},{"kind":"Argument","name":{"kind":"Name","value":"searchSigned"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchSigned"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalCount"}}]}}]}}]}}]} as unknown as DocumentNode<GetGsyncStatsQuery, GetGsyncStatsQueryVariables>;
export const GetMsatStatsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMsatStats"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"searchSigned"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"total"},"name":{"kind":"Name","value":"customersCursor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"1"}},{"kind":"Argument","name":{"kind":"Name","value":"searchSigned"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchSigned"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalCount"}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"connected"},"name":{"kind":"Name","value":"customersCursor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"1"}},{"kind":"Argument","name":{"kind":"Name","value":"searchMsatConnected"},"value":{"kind":"IntValue","value":"1"}},{"kind":"Argument","name":{"kind":"Name","value":"searchSigned"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchSigned"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalCount"}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"pending"},"name":{"kind":"Name","value":"customersCursor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"1"}},{"kind":"Argument","name":{"kind":"Name","value":"searchMsatConnected"},"value":{"kind":"IntValue","value":"0"}},{"kind":"Argument","name":{"kind":"Name","value":"searchSigned"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchSigned"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalCount"}}]}}]}}]}}]} as unknown as DocumentNode<GetMsatStatsQuery, GetMsatStatsQueryVariables>;
export const GetUtilmateStatsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUtilmateStats"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"searchSigned"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"total"},"name":{"kind":"Name","value":"customersCursor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"1"}},{"kind":"Argument","name":{"kind":"Name","value":"searchSigned"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchSigned"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalCount"}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"connected"},"name":{"kind":"Name","value":"customersCursor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"1"}},{"kind":"Argument","name":{"kind":"Name","value":"searchUtilmateStatus"},"value":{"kind":"IntValue","value":"1"}},{"kind":"Argument","name":{"kind":"Name","value":"searchUtilmateApiPushed"},"value":{"kind":"IntValue","value":"1"}},{"kind":"Argument","name":{"kind":"Name","value":"searchSigned"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchSigned"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalCount"}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"skipConnect"},"name":{"kind":"Name","value":"customersCursor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"1"}},{"kind":"Argument","name":{"kind":"Name","value":"searchUtilmateStatus"},"value":{"kind":"IntValue","value":"1"}},{"kind":"Argument","name":{"kind":"Name","value":"searchUtilmateApiPushed"},"value":{"kind":"IntValue","value":"0"}},{"kind":"Argument","name":{"kind":"Name","value":"searchSigned"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchSigned"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalCount"}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"pending"},"name":{"kind":"Name","value":"customersCursor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"1"}},{"kind":"Argument","name":{"kind":"Name","value":"searchUtilmateStatus"},"value":{"kind":"IntValue","value":"0"}},{"kind":"Argument","name":{"kind":"Name","value":"searchSigned"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchSigned"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalCount"}}]}}]}}]}}]} as unknown as DocumentNode<GetUtilmateStatsQuery, GetUtilmateStatsQueryVariables>;