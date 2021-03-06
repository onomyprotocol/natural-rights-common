export interface NRClient {
  readonly accountId: string
  readonly clientId: string
  readonly rootDocumentId: string

  readonly login: () => Promise<{
    readonly accountId: string
    readonly rootDocumentId: string
  }>

  readonly registerAccount: () => Promise<{
    readonly accountId: string
    readonly rootDocumentId: string
  }>

  readonly authorizeClient: (clientToAuthSignPubKey: string) => Promise<void>

  readonly deauthorizeClient: (
    clientToDeauthSignPubKey?: string
  ) => Promise<void>

  readonly createGroup: () => Promise<string>

  readonly addReaderToGroup: (
    groupSignPubKey: string,
    memberAccountSignPubKey: string
  ) => Promise<void>

  readonly addSignerToGroup: (
    groupSignPubKey: string,
    memberAccountSignPubKey: string
  ) => Promise<void>

  readonly removeMemberFromGroup: (
    groupSignPubKey: string,
    memberAccountSignPubKey: string
  ) => Promise<void>

  readonly addAdminToGroup: (
    groupSignPubKey: string,
    memberAccountSignPubKey: string
  ) => Promise<void>

  readonly removeAdminFromGroup: (
    groupSignPubKey: string,
    adminToRemoveAccountSignPubKey: string
  ) => Promise<void>

  readonly createDocument: () => Promise<{ readonly id: string }>

  readonly grantReadAccess: (
    documentSignPubKey: string,
    grantKind: NRGrantKind,
    granteeSignPubKey: string
  ) => Promise<void>

  readonly grantSignAccess: (
    documentSignPubKey: string,
    grantKind: NRGrantKind,
    granteeSignPubKey: string
  ) => Promise<void>

  readonly revokeAccess: (
    documentSignPubKey: string,
    grantKind: NRGrantKind,
    granteeSignPubKey: string
  ) => Promise<void>

  readonly signDocumentHashes: (
    documentSignPubKey: string,
    hashes: readonly string[]
  ) => Promise<readonly string[]>

  readonly decryptDocumentTexts: (
    documentSignPubKey: string,
    ciphertexts: readonly string[]
  ) => Promise<readonly string[]>

  readonly signDocumentTexts: (
    documentSignPubKey: string,
    textsToSign: readonly string[]
  ) => Promise<readonly string[]>

  readonly encryptDocumentTexts: (
    documentSignPubKey: string,
    plaintexts: readonly string[]
  ) => Promise<
    ReadonlyArray<
      | string
      | {
          readonly ct: any
          readonly iv: any
          readonly s: any
        }
    >
  >
}

/**
 * Interface to a local or remote instance of the Natural Rights service
 */
export interface NRServiceInterface {
  readonly primitives: PREPrimitivesInterface
  readonly request: (request: NRRequest) => Promise<NRResponse>
}

/**
 * A request to a Natural Rights service
 */
export interface NRRequest {
  readonly clientId: string
  readonly signature: string
  readonly body: string
}

/**
 * A response to a Natural Rights request
 */
export interface NRResponse {
  readonly results: readonly NRResult[]
}

/**
 * Any action supported by the Natural Rights service API
 */
export type NRAction =
  | NRInitializeAccountAction // Going away
  | NRLoginAction
  | NRAuthorizeClientAction
  | NRDeauthorizeClientAction
  | NRCreateGroupAction
  | NRAddMemberToGroupAction
  | NRRemoveMemberFromGroupAction
  | NRAddAdminToGroupAction
  | NRRemoveAdminFromGroupAction
  | NRCreateDocumentAction
  | NRSignDocumentAction
  | NRGrantAccessAction
  | NRDecryptDocumentAction
  | NRRevokeAccessAction
  | NRUpdateDocumentAction
  | NRGetPubKeysAction
  | NRGetKeyPairsAction

/**
 * Any action result supported by the Natural Rights service API
 */
export type NRResult =
  | NRInitializeAccountResult
  | NRLoginResult
  | NRAuthorizeClientResult
  | NRDeauthorizeClientResult
  | NRCreateGroupResult
  | NRAddMemberToGroupResult
  | NRRemoveMemberFromGroupResult
  | NRAddAdminToGroupResult
  | NRRemoveAdminFromGroupResult
  | NRCreateDocumentResult
  | NRSignDocumentResult
  | NRGrantAccessResult
  | NRDecryptDocumentResult
  | NRRevokeAccessResult
  | NRUpdateDocumentResult
  | NRGetPubKeysResult
  | NRGetKeyPairsResult
  | NRErrorResult

/**
 * Common fields shared by all NRResult's
 */
export interface NRResultBase {
  readonly type: string
  readonly success: boolean
  readonly error: string
}

export interface NRErrorResult extends NRResultBase {
  readonly payload: NRAction['payload'] | null
  readonly type: NRAction['type']
  readonly success: false
}

/**
 * Request to create a new account
 */
export interface NRInitializeAccountAction {
  readonly type: 'InitializeAccount'
  readonly payload: NRInitializeAccountPayload
}

/**
 * Response to creating a new account
 */
export interface NRInitializeAccountResult extends NRResultBase {
  readonly type: 'InitializeAccount'
  readonly payload: NRInitializeAccountResultPayload | null
}

/**
 * Parameters to Initialize Account request
 */
export interface NRInitializeAccountPayload {
  readonly accountId: string
  readonly signPubKey: string
  readonly cryptPubKey: string
  readonly encCryptPrivKey: string
  readonly encSignPrivKey: string
  readonly rootDocCryptPubKey: string
  readonly rootDocEncCryptPrivKey: string
}

/**
 * Data returned in Initialize Account response
 */
export type NRInitializeAccountResultPayload = NRInitializeAccountPayload

/**
 * Request to check if account is associated with client
 */
export interface NRLoginAction {
  readonly type: 'Login'
  readonly payload: NRLoginActionPayload
}

/**
 * Response to asking if account is associated with client
 */
export interface NRLoginResult extends NRResultBase {
  readonly type: 'Login'
  readonly payload: NRLoginActionResultPayload
}

/**
 * Parameters to Login request
 */
export interface NRLoginActionPayload {
  readonly cryptPubKey: string
}

/**
 * Data returned in Login response
 */
export interface NRLoginActionResultPayload {
  readonly rootDocumentId: string
  readonly accountId: string
}

/**
 * Request to authorize another client on current account
 */
export interface NRAuthorizeClientAction {
  readonly type: 'AuthorizeClient'
  readonly payload: NRAuthorizeClientActionPayload
}

/**
 * Response to requesting to authorize another client
 */
export interface NRAuthorizeClientResult extends NRResultBase {
  readonly type: 'AuthorizeClient'
  readonly payload: NRAuthorizeClientResultPayload
}

/**
 * Parameters to Authorize Client request
 */
export interface NRAuthorizeClientActionPayload {
  readonly accountId: string
  readonly clientId: string
  readonly cryptTransformKey: string

  // If new account:
  readonly accountSignPubKey?: string
  readonly accountCryptPubKey?: string
  readonly accountEncCryptPrivKey?: string
  readonly accountEncSignPrivKey?: string
}

/**
 * Data returned in Authorize Client response
 */
export interface NRAuthorizeClientResultPayload {
  readonly clientId: string
  readonly accountId: string
}

/**
 * Request to deauthorize a client on the current account
 */
export interface NRDeauthorizeClientAction {
  readonly type: 'DeauthorizeClient'
  readonly payload: NRDeauthorizeClientActionPayload
}

/**
 * Response to request to deauthorize a client
 */
export interface NRDeauthorizeClientResult extends NRResultBase {
  readonly type: 'DeauthorizeClient'
  readonly payload: NRDeauthorizeClientResultPayload
}

/**
 * Parameters to Authorize Client request
 */
export interface NRDeauthorizeClientActionPayload {
  readonly clientId: string
  readonly accountId: string
}

/**
 * Data returned in Deauthorize Client response
 */
export type NRDeauthorizeClientResultPayload = NRDeauthorizeClientActionPayload

/**
 * Request to create a new group
 */
export interface NRCreateGroupAction {
  readonly type: 'CreateGroup'
  readonly payload: NRCreateGroupActionPayload
}

/**
 * Response to request to create a new group
 */
export interface NRCreateGroupResult extends NRResultBase {
  readonly type: 'CreateGroup'
  readonly payload: NRCreateGroupResultPayload
}

/**
 * Parameters to Create Group request
 */
export interface NRCreateGroupActionPayload {
  readonly groupId: string
  readonly accountId: string
  readonly cryptPubKey: string
  readonly encCryptPrivKey: string
  readonly encSignPrivKey: string
}

/**
 * Data returned in Create Group response
 */
export type NRCreateGroupResultPayload = NRCreateGroupActionPayload

/**
 * Request to add a member to a group
 */
export interface NRAddMemberToGroupAction {
  readonly type: 'AddMemberToGroup'
  readonly payload: NRAddMemberToGroupActionPayload
}

/**
 * Response to request to add a member
 */
export interface NRAddMemberToGroupResult extends NRResultBase {
  readonly type: NRAddMemberToGroupAction['type']
  readonly payload: NRAddMemberToGroupResultPayload
}

/**
 * Parameters to add member request
 */
export interface NRAddMemberToGroupActionPayload {
  readonly groupId: string
  readonly accountId: string
  readonly cryptTransformKey?: string

  readonly canSign?: boolean
}

/**
 * Data returned in add member response
 */
export interface NRAddMemberToGroupResultPayload {
  readonly groupId: string
  readonly accountId: string

  readonly canSign: boolean
}

/**
 * Request to remove a member from a group
 */
export interface NRRemoveMemberFromGroupAction {
  readonly type: 'RemoveMemberFromGroup'
  readonly payload: NRRemoveMemberFromGroupActionPayload
}

/**
 * Response to request to remove a member
 */
export interface NRRemoveMemberFromGroupResult extends NRResultBase {
  readonly type: NRRemoveMemberFromGroupAction['type']
  readonly payload: NRRemoveMemberFromGroupResultPayload
}

/**
 * Parameters to remove member request
 */
export interface NRRemoveMemberFromGroupActionPayload {
  readonly groupId: string
  readonly accountId: string
}

/**
 * Data returned in remove member response
 */
export type NRRemoveMemberFromGroupResultPayload = NRRemoveMemberFromGroupActionPayload

/**
 * Request to add an admin to a group
 */
export interface NRAddAdminToGroupAction {
  readonly type: 'AddAdminToGroup'
  readonly payload: NRAddAdminToGroupActionPayload
}

/**
 * Response to request to add an admin
 */
export interface NRAddAdminToGroupResult extends NRResultBase {
  readonly type: NRAddAdminToGroupAction['type']
  readonly payload: NRAddAdminToGroupResultPayload
}

/**
 * Parameters to add admin request
 */
export interface NRAddAdminToGroupActionPayload {
  readonly groupId: string
  readonly accountId: string
  readonly encCryptPrivKey: string
}

/**
 * Data returned in add admin response
 */
export type NRAddAdminToGroupResultPayload = NRAddAdminToGroupActionPayload

/**
 * Request to remove an admin from a group
 */
export interface NRRemoveAdminFromGroupAction {
  readonly type: 'RemoveAdminFromGroup'
  readonly payload: NRRemoveAdminFromGroupActionPayload
}

/**
 * Response to request to remove an admin
 */
export interface NRRemoveAdminFromGroupResult extends NRResultBase {
  readonly type: NRRemoveAdminFromGroupAction['type']
  readonly payload: NRRemoveAdminFromGroupActionPayload
}

/**
 * Parameters to remove admin request
 */
export interface NRRemoveAdminFromGroupActionPayload {
  readonly groupId: string
  readonly accountId: string
}

/**
 * Data returned in remove admin response
 */
export type NRRemoveAdminFromGroupResultPayload = NRRemoveAdminFromGroupActionPayload

/**
 * Request to create a document
 */
export interface NRCreateDocumentAction {
  readonly type: 'CreateDocument'
  readonly payload: NRCreateDocumentActionPayload
}

/**
 * Response to request to create a document
 */
export interface NRCreateDocumentResult extends NRResultBase {
  readonly type: NRCreateDocumentAction['type']
  readonly payload: NRCreateDocumentResultPayload
}

/**
 * Parameters to create document request
 */
export interface NRCreateDocumentActionPayload {
  readonly cryptAccountId: string
  readonly cryptPubKey: string

  readonly creatorId: string
  readonly encCryptPrivKey: string
}

/**
 * Data returned in create document response
 */
export interface NRCreateDocumentResultPayload {
  readonly documentId: string
}

/**
 * Request to sign a document
 */
export interface NRSignDocumentAction {
  readonly type: 'SignDocument'
  readonly payload: NRSignDocumentActionPayload
}

/**
 * Response to sign document request
 */
export interface NRSignDocumentResult extends NRResultBase {
  readonly type: NRSignDocumentAction['type']
  readonly payload: NRSignDocumentResultPayload
}

/**
 * Parameters to sign document request
 */
export interface NRSignDocumentActionPayload {
  readonly documentId: string
  readonly hashes: readonly string[]
}

/**
 * Data returned in sign document response
 */
export interface NRSignDocumentResultPayload {
  readonly signatures: readonly string[]
}

/**
 * Request to grant access to a document
 */
export interface NRGrantAccessAction {
  readonly type: 'GrantAccess'
  readonly payload: NRGrantAccessActionPayload
}

/**
 * Response to request to grant access
 */
export interface NRGrantAccessResult extends NRResultBase {
  readonly type: NRGrantAccessAction['type']
  readonly payload: NRGrantAccessResultPayload
}

/**
 * Parameters to grant access request
 */
export interface NRGrantAccessActionPayload {
  readonly documentId: string
  readonly kind: NRGrantKind
  readonly id: string
  readonly encCryptPrivKey?: string

  readonly canSign?: boolean
}

/**
 * Data returned in grant access response
 */
export type NRGrantAccessResultPayload = NRGrantAccessActionPayload

/**
 * Request to decrypt a document
 */
export interface NRDecryptDocumentAction {
  readonly type: 'DecryptDocument'
  readonly payload: NRDecryptDocumentActionPayload
}

/**
 * Response to decrypt document request
 */
export interface NRDecryptDocumentResult extends NRResultBase {
  readonly type: NRDecryptDocumentAction['type']
  readonly payload: NRDecryptDocumentResultPayload
}

/**
 * Parameters to decrypt document request
 */
export interface NRDecryptDocumentActionPayload {
  readonly documentId: string
}

/**
 * Data returned in decrypt document response
 */
export interface NRDecryptDocumentResultPayload {
  readonly documentId: string
  readonly encCryptPrivKey: string
}

/**
 * Request to revoke access to a document
 */
export interface NRRevokeAccessAction {
  readonly type: 'RevokeAccess'
  readonly payload: NRRevokeAccessActionPayload
}

/**
 * Response to revoke access request
 */
export interface NRRevokeAccessResult extends NRResultBase {
  readonly type: NRRevokeAccessAction['type']
  readonly payload: NRRevokeAccessResultPayload
}

/**
 * Parameters to revoke access request
 */
export interface NRRevokeAccessActionPayload {
  readonly documentId: string
  readonly kind: NRGrantKind
  readonly id: string
}

/**
 * Data returned in revoke access response
 */
export type NRRevokeAccessResultPayload = NRRevokeAccessActionPayload

/**
 * Request to update document encryption keys
 */
export interface NRUpdateDocumentAction {
  readonly type: 'UpdateDocument'
  readonly payload: NRUpdateDocumentActionPayload
}

/**
 * Response to update document request
 */
export interface NRUpdateDocumentResult extends NRResultBase {
  readonly type: NRUpdateDocumentAction['type']
  readonly payload: NRUpdateDocumentResultPayload
}

/**
 * Parameters to update document request
 */
export interface NRUpdateDocumentActionPayload {
  readonly documentId: string
  readonly cryptAccountId: string
  readonly cryptPubKey: string
  readonly encCryptPrivKey: string
}

/**
 * Data returned in update document response
 */
export type NRUpdateDocumentResultPayload = NRUpdateDocumentActionPayload

/**
 * Request public keys for a user/group/document
 */
export interface NRGetPubKeysAction {
  readonly type: 'GetPubKeys'
  readonly payload: NRGetPubKeysActionPayload
}

/**
 * Response to request for public keys
 */
export interface NRGetPubKeysResult extends NRResultBase {
  readonly type: NRGetPubKeysAction['type']
  readonly payload: NRGetPubKeysResultPayload
}

/**
 * Parameters to request for public keys
 */
export interface NRGetPubKeysActionPayload {
  readonly kind: NRSignatureKind
  readonly id: string
}

/**
 * Data returned in response to request for public keys
 */
export interface NRGetPubKeysResultPayload extends NRGetPubKeysActionPayload {
  readonly signPubKey: string
  readonly cryptPubKey: string
}

/**
 * Request key pair data for a user/group/document
 */
export interface NRGetKeyPairsAction {
  readonly type: 'GetKeyPairs'
  readonly payload: NRGetKeyPairsActionPayload
}

/**
 * Response to request for key pair data
 */
export interface NRGetKeyPairsResult extends NRResultBase {
  readonly type: NRGetKeyPairsAction['type']
  readonly payload: NRGetKeyPairsResultPayload
}

/**
 * Parameters to request for key pair data
 */
export interface NRGetKeyPairsActionPayload {
  readonly kind: NRGrantKind
  readonly id: string
}

/**
 * Data returned in response to request for key pair data
 */
export interface NRGetKeyPairsResultPayload extends NRGetKeyPairsActionPayload {
  readonly signPubKey: string
  readonly encSignPrivKey: string
  readonly cryptPubKey: string
  readonly encCryptPrivKey: string
}

/**
 * Pluggable interface for Proxy Re-Encryption primitives
 */
export interface PREPrimitivesInterface {
  /**
   * Generate an transformable encryption keypair
   */
  readonly cryptKeyGen: () => Promise<NRKeyPair>

  /**
   * Generate a transform key from one key pair to another public key
   */
  readonly cryptTransformKeyGen: (
    fromKeyPair: NRKeyPair,
    toPubKey: string,
    signKeyPair: NRKeyPair
  ) => Promise<string>

  /**
   * Generate a signing keypair
   */
  readonly signKeyGen: () => Promise<NRKeyPair>

  /**
   * Encrypt a plaintext with transformable encryption
   */
  readonly encrypt: (
    pubKey: string,
    plaintext: string,
    signKeyPair: NRKeyPair
  ) => Promise<string>

  /**
   * Transform an encrypted text with the provided transform key
   */
  readonly cryptTransform: (
    transformKey: string,
    ciphertext: string,
    signKeyPair: NRKeyPair
  ) => Promise<string>

  /**
   * Decrypt a ciphertext with transformable encryption
   */
  readonly decrypt: (keyPair: NRKeyPair, ciphertext: string) => Promise<string>

  /**
   * Sign a text with a signing keypair generated by signKeyGen
   */
  readonly sign: (keyPair: NRKeyPair, text: string) => Promise<string>

  /**
   * Verify a signature
   */
  readonly verify: (
    pubKey: string,
    signature: string,
    text: string
  ) => Promise<boolean>
}

export type NRGrantKind = 'account' | 'group'
export type NRSignatureKind = 'account' | 'client' | 'group' | 'document'

/**
 * Any asymmettric encryption Key Pair used by Natural Rights
 */
export interface NRKeyPair {
  readonly pubKey: string
  readonly privKey: string
}

export interface NRClientCrypto {
  /**
   * Return any public keys this instance has private keys for
   */
  readonly publicKeys: () => {
    readonly accountCryptPubKey?: string
    readonly accountSignPubKey?: string
    readonly clientSignPubKey?: string
    readonly clientCryptPubKey?: string
  }

  /**
   * Sign one or more NRAction's with this account or client
   */
  readonly signRequest: (params: {
    readonly actions: readonly NRAction[]
    readonly as?: 'client' | 'account'
  }) => Promise<NRRequest>

  /**
   * Authorize a client on an account
   */
  readonly createClientAuth?: (params: {
    readonly accountCryptPubKey: string
    readonly accountEncCryptPrivKey: string
    readonly clientCryptPubKey: string
  }) => Promise<{
    // The PRE transform key from account -> client
    readonly clientCryptTransformKey: string
  }>

  /**
   * Return account credentials to register with service
   *
   * May go away after next refactor stage and can be ignored by companion
   */
  readonly createAccount?: () => Promise<{
    readonly accountCryptPubKey: string
    readonly accountSignPubKey: string

    // Optional encrypted account secrets for NR service management
    readonly accountEncCryptPrivKey?: string
    readonly accountEncSignPrivKey?: string

    // Optionally include this if not using account keys directly
    readonly clientCryptTransformKey?: string
  }>

  /**
   * Generate and encrypt keypair for a document
   */
  readonly createDocument?: (params: {
    readonly accountCryptPubKey: string
  }) => Promise<{
    readonly documentCryptPubKey: string

    // Document encryption key encrypted with account pub key
    readonly documentEncCryptPrivKey: string
  }>

  /**
   * Generate an encrypted document private key for the grantee
   */
  readonly createGrant?: (params: {
    readonly granteeCryptPubKey: string     
    readonly documentEncCryptPrivKey: string
  }) => Promise<{
    // Document encryption key encrypted with grantee pub key
    readonly documentEncCryptPrivKeyForGrantee: string
  }>

  /**
   * Generate and encrypt keypairs for a group
   */
  readonly createGroup?: (params: {
    readonly accountCryptPubKey: string
  }) => Promise<{
    readonly groupCryptPubKey: string

    readonly memberCryptTransformKey: string // Transform key for creator

    // Encrypted with account public key
    readonly groupEncCryptPrivKey: string

    // Encrypted with account public key
    readonly groupEncSignPrivKey: string

    readonly groupSignPubKey: string
  }>

  /**
   * Generate transform key and optional encrypted private key for group member
   */
  readonly createMembership?: (params: {
    readonly groupCryptPubKey: string
    readonly groupEncCryptPrivKey: string
    readonly memberCryptPubKey: string
    readonly admin?: boolean
  }) => Promise<{
    // Encryption transform key from group -> member
    readonly memberCryptTransformKey: string

    // If adding as admin, this should be the group crypt priv key encrypted with member pub key
    readonly encCryptPrivKey?: string
  }>

  /**
   * Encrypt a collection of ciphertexts for a given document
   */
  readonly encryptDocumentTexts?: (params: {
    readonly documentEncCryptPrivKey: string
    readonly plaintexts: readonly string[]
  }) => Promise<{
    readonly ciphertexts: readonly string[]
  }>

  /**
   * Decrypt a collection of ciphertexts from a given document
   */
  readonly decryptDocumentTexts?: (params: {
    readonly documentEncCryptPrivKey: string
    readonly ciphertexts: readonly string[]
  }) => Promise<{
    readonly plaintexts: readonly string[]
  }>
}
