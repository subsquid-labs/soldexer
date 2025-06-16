import { struct, unit } from '@subsquid/borsh'
import { instruction } from '../abi.support'
import {
  ApproveUseAuthorityArgs,
  BurnArgs,
  CreateArgs,
  CreateMasterEditionArgs,
  CreateMetadataAccountArgs,
  CreateMetadataAccountArgsV2,
  CreateMetadataAccountArgsV3,
  DelegateArgs,
  LockArgs,
  MintArgs,
  MintNewEditionFromMasterEditionViaTokenArgs,
  MintPrintingTokensViaTokenArgs,
  PrintArgs,
  RevokeArgs,
  SetCollectionSizeArgs,
  SetReservationListArgs,
  TransferArgs,
  TransferOutOfEscrowArgs,
  UnlockArgs,
  UpdateArgs,
  UpdateMetadataAccountArgs,
  UpdateMetadataAccountArgsV2,
  UseArgs,
  UtilizeArgs,
  VerificationArgs,
} from './types'

export interface CreateMetadataAccount {
  createMetadataAccountArgs: CreateMetadataAccountArgs
}

export const createMetadataAccount = instruction(
  {
    d1: '0x00',
  },
  {
    metadata: 0,
    mint: 1,
    mintAuthority: 2,
    payer: 3,
    updateAuthority: 4,
    systemProgram: 5,
    rent: 6,
  },
  struct({
    createMetadataAccountArgs: CreateMetadataAccountArgs,
  }),
)

export interface UpdateMetadataAccount {
  updateMetadataAccountArgs: UpdateMetadataAccountArgs
}

export const updateMetadataAccount = instruction(
  {
    d1: '0x01',
  },
  {
    metadata: 0,
    updateAuthority: 1,
  },
  struct({
    updateMetadataAccountArgs: UpdateMetadataAccountArgs,
  }),
)

export interface DeprecatedCreateMasterEdition {
  createMasterEditionArgs: CreateMasterEditionArgs
}

export const deprecatedCreateMasterEdition = instruction(
  {
    d1: '0x02',
  },
  {
    edition: 0,
    mint: 1,
    printingMint: 2,
    oneTimePrintingAuthorizationMint: 3,
    updateAuthority: 4,
    printingMintAuthority: 5,
    mintAuthority: 6,
    metadata: 7,
    payer: 8,
    tokenProgram: 9,
    systemProgram: 10,
    rent: 11,
    oneTimePrintingAuthorizationMintAuthority: 12,
  },
  struct({
    createMasterEditionArgs: CreateMasterEditionArgs,
  }),
)

export type DeprecatedMintNewEditionFromMasterEditionViaPrintingToken = undefined

export const deprecatedMintNewEditionFromMasterEditionViaPrintingToken = instruction(
  {
    d1: '0x03',
  },
  {
    metadata: 0,
    edition: 1,
    masterEdition: 2,
    mint: 3,
    mintAuthority: 4,
    printingMint: 5,
    masterTokenAccount: 6,
    editionMarker: 7,
    burnAuthority: 8,
    payer: 9,
    masterUpdateAuthority: 10,
    masterMetadata: 11,
    tokenProgram: 12,
    systemProgram: 13,
    rent: 14,
    reservationList: 15,
  },
  unit,
)

export type UpdatePrimarySaleHappenedViaToken = undefined

export const updatePrimarySaleHappenedViaToken = instruction(
  {
    d1: '0x04',
  },
  {
    metadata: 0,
    owner: 1,
    token: 2,
  },
  unit,
)

export interface DeprecatedSetReservationList {
  setReservationListArgs: SetReservationListArgs
}

export const deprecatedSetReservationList = instruction(
  {
    d1: '0x05',
  },
  {
    masterEdition: 0,
    reservationList: 1,
    resource: 2,
  },
  struct({
    setReservationListArgs: SetReservationListArgs,
  }),
)

export type DeprecatedCreateReservationList = undefined

export const deprecatedCreateReservationList = instruction(
  {
    d1: '0x06',
  },
  {
    reservationList: 0,
    payer: 1,
    updateAuthority: 2,
    masterEdition: 3,
    resource: 4,
    metadata: 5,
    systemProgram: 6,
    rent: 7,
  },
  unit,
)

export type SignMetadata = undefined

export const signMetadata = instruction(
  {
    d1: '0x07',
  },
  {
    metadata: 0,
    creator: 1,
  },
  unit,
)

export interface DeprecatedMintPrintingTokensViaToken {
  mintPrintingTokensViaTokenArgs: MintPrintingTokensViaTokenArgs
}

export const deprecatedMintPrintingTokensViaToken = instruction(
  {
    d1: '0x08',
  },
  {
    destination: 0,
    token: 1,
    oneTimePrintingAuthorizationMint: 2,
    printingMint: 3,
    burnAuthority: 4,
    metadata: 5,
    masterEdition: 6,
    tokenProgram: 7,
    rent: 8,
  },
  struct({
    mintPrintingTokensViaTokenArgs: MintPrintingTokensViaTokenArgs,
  }),
)

export interface DeprecatedMintPrintingTokens {
  mintPrintingTokensViaTokenArgs: MintPrintingTokensViaTokenArgs
}

export const deprecatedMintPrintingTokens = instruction(
  {
    d1: '0x09',
  },
  {
    destination: 0,
    printingMint: 1,
    updateAuthority: 2,
    metadata: 3,
    masterEdition: 4,
    tokenProgram: 5,
    rent: 6,
  },
  struct({
    mintPrintingTokensViaTokenArgs: MintPrintingTokensViaTokenArgs,
  }),
)

export interface CreateMasterEdition {
  createMasterEditionArgs: CreateMasterEditionArgs
}

export const createMasterEdition = instruction(
  {
    d1: '0x0a',
  },
  {
    edition: 0,
    mint: 1,
    updateAuthority: 2,
    mintAuthority: 3,
    payer: 4,
    metadata: 5,
    tokenProgram: 6,
    systemProgram: 7,
    rent: 8,
  },
  struct({
    createMasterEditionArgs: CreateMasterEditionArgs,
  }),
)

export interface MintNewEditionFromMasterEditionViaToken {
  mintNewEditionFromMasterEditionViaTokenArgs: MintNewEditionFromMasterEditionViaTokenArgs
}

export const mintNewEditionFromMasterEditionViaToken = instruction(
  {
    d1: '0x0b',
  },
  {
    newMetadata: 0,
    newEdition: 1,
    masterEdition: 2,
    newMint: 3,
    editionMarkPda: 4,
    newMintAuthority: 5,
    payer: 6,
    tokenAccountOwner: 7,
    tokenAccount: 8,
    newMetadataUpdateAuthority: 9,
    metadata: 10,
    tokenProgram: 11,
    systemProgram: 12,
    rent: 13,
  },
  struct({
    mintNewEditionFromMasterEditionViaTokenArgs: MintNewEditionFromMasterEditionViaTokenArgs,
  }),
)

export type ConvertMasterEditionV1ToV2 = undefined

export const convertMasterEditionV1ToV2 = instruction(
  {
    d1: '0x0c',
  },
  {
    masterEdition: 0,
    oneTimeAuth: 1,
    printingMint: 2,
  },
  unit,
)

export interface MintNewEditionFromMasterEditionViaVaultProxy {
  mintNewEditionFromMasterEditionViaTokenArgs: MintNewEditionFromMasterEditionViaTokenArgs
}

export const mintNewEditionFromMasterEditionViaVaultProxy = instruction(
  {
    d1: '0x0d',
  },
  {
    newMetadata: 0,
    newEdition: 1,
    masterEdition: 2,
    newMint: 3,
    editionMarkPda: 4,
    newMintAuthority: 5,
    payer: 6,
    vaultAuthority: 7,
    safetyDepositStore: 8,
    safetyDepositBox: 9,
    vault: 10,
    newMetadataUpdateAuthority: 11,
    metadata: 12,
    tokenProgram: 13,
    tokenVaultProgram: 14,
    systemProgram: 15,
    rent: 16,
  },
  struct({
    mintNewEditionFromMasterEditionViaTokenArgs: MintNewEditionFromMasterEditionViaTokenArgs,
  }),
)

export type PuffMetadata = undefined

export const puffMetadata = instruction(
  {
    d1: '0x0e',
  },
  {
    metadata: 0,
  },
  unit,
)

export interface UpdateMetadataAccountV2 {
  updateMetadataAccountArgsV2: UpdateMetadataAccountArgsV2
}

export const updateMetadataAccountV2 = instruction(
  {
    d1: '0x0f',
  },
  {
    metadata: 0,
    updateAuthority: 1,
  },
  struct({
    updateMetadataAccountArgsV2: UpdateMetadataAccountArgsV2,
  }),
)

export interface CreateMetadataAccountV2 {
  createMetadataAccountArgsV2: CreateMetadataAccountArgsV2
}

export const createMetadataAccountV2 = instruction(
  {
    d1: '0x10',
  },
  {
    metadata: 0,
    mint: 1,
    mintAuthority: 2,
    payer: 3,
    updateAuthority: 4,
    systemProgram: 5,
    rent: 6,
  },
  struct({
    createMetadataAccountArgsV2: CreateMetadataAccountArgsV2,
  }),
)

export interface CreateMasterEditionV3 {
  createMasterEditionArgs: CreateMasterEditionArgs
}

export const createMasterEditionV3 = instruction(
  {
    d1: '0x11',
  },
  {
    edition: 0,
    mint: 1,
    updateAuthority: 2,
    mintAuthority: 3,
    payer: 4,
    metadata: 5,
    tokenProgram: 6,
    systemProgram: 7,
    rent: 8,
  },
  struct({
    createMasterEditionArgs: CreateMasterEditionArgs,
  }),
)

export type VerifyCollection = undefined

export const verifyCollection = instruction(
  {
    d1: '0x12',
  },
  {
    metadata: 0,
    collectionAuthority: 1,
    payer: 2,
    collectionMint: 3,
    collection: 4,
    collectionMasterEditionAccount: 5,
    collectionAuthorityRecord: 6,
  },
  unit,
)

export interface Utilize {
  utilizeArgs: UtilizeArgs
}

export const utilize = instruction(
  {
    d1: '0x13',
  },
  {
    metadata: 0,
    tokenAccount: 1,
    mint: 2,
    useAuthority: 3,
    owner: 4,
    tokenProgram: 5,
    ataProgram: 6,
    systemProgram: 7,
    rent: 8,
    useAuthorityRecord: 9,
    burner: 10,
  },
  struct({
    utilizeArgs: UtilizeArgs,
  }),
)

export interface ApproveUseAuthority {
  approveUseAuthorityArgs: ApproveUseAuthorityArgs
}

export const approveUseAuthority = instruction(
  {
    d1: '0x14',
  },
  {
    useAuthorityRecord: 0,
    owner: 1,
    payer: 2,
    user: 3,
    ownerTokenAccount: 4,
    metadata: 5,
    mint: 6,
    burner: 7,
    tokenProgram: 8,
    systemProgram: 9,
    rent: 10,
  },
  struct({
    approveUseAuthorityArgs: ApproveUseAuthorityArgs,
  }),
)

export type RevokeUseAuthority = undefined

export const revokeUseAuthority = instruction(
  {
    d1: '0x15',
  },
  {
    useAuthorityRecord: 0,
    owner: 1,
    user: 2,
    ownerTokenAccount: 3,
    mint: 4,
    metadata: 5,
    tokenProgram: 6,
    systemProgram: 7,
    rent: 8,
  },
  unit,
)

export type UnverifyCollection = undefined

export const unverifyCollection = instruction(
  {
    d1: '0x16',
  },
  {
    metadata: 0,
    collectionAuthority: 1,
    collectionMint: 2,
    collection: 3,
    collectionMasterEditionAccount: 4,
    collectionAuthorityRecord: 5,
  },
  unit,
)

export type ApproveCollectionAuthority = undefined

export const approveCollectionAuthority = instruction(
  {
    d1: '0x17',
  },
  {
    collectionAuthorityRecord: 0,
    newCollectionAuthority: 1,
    updateAuthority: 2,
    payer: 3,
    metadata: 4,
    mint: 5,
    systemProgram: 6,
    rent: 7,
  },
  unit,
)

export type RevokeCollectionAuthority = undefined

export const revokeCollectionAuthority = instruction(
  {
    d1: '0x18',
  },
  {
    collectionAuthorityRecord: 0,
    delegateAuthority: 1,
    revokeAuthority: 2,
    metadata: 3,
    mint: 4,
  },
  unit,
)

export type SetAndVerifyCollection = undefined

export const setAndVerifyCollection = instruction(
  {
    d1: '0x19',
  },
  {
    metadata: 0,
    collectionAuthority: 1,
    payer: 2,
    updateAuthority: 3,
    collectionMint: 4,
    collection: 5,
    collectionMasterEditionAccount: 6,
    collectionAuthorityRecord: 7,
  },
  unit,
)

export type FreezeDelegatedAccount = undefined

export const freezeDelegatedAccount = instruction(
  {
    d1: '0x1a',
  },
  {
    delegate: 0,
    tokenAccount: 1,
    edition: 2,
    mint: 3,
    tokenProgram: 4,
  },
  unit,
)

export type ThawDelegatedAccount = undefined

export const thawDelegatedAccount = instruction(
  {
    d1: '0x1b',
  },
  {
    delegate: 0,
    tokenAccount: 1,
    edition: 2,
    mint: 3,
    tokenProgram: 4,
  },
  unit,
)

export type RemoveCreatorVerification = undefined

export const removeCreatorVerification = instruction(
  {
    d1: '0x1c',
  },
  {
    metadata: 0,
    creator: 1,
  },
  unit,
)

export type BurnNft = undefined

export const burnNft = instruction(
  {
    d1: '0x1d',
  },
  {
    metadata: 0,
    owner: 1,
    mint: 2,
    tokenAccount: 3,
    masterEditionAccount: 4,
    splTokenProgram: 5,
    collectionMetadata: 6,
  },
  unit,
)

export type VerifySizedCollectionItem = undefined

export const verifySizedCollectionItem = instruction(
  {
    d1: '0x1e',
  },
  {
    metadata: 0,
    collectionAuthority: 1,
    payer: 2,
    collectionMint: 3,
    collection: 4,
    collectionMasterEditionAccount: 5,
    collectionAuthorityRecord: 6,
  },
  unit,
)

export type UnverifySizedCollectionItem = undefined

export const unverifySizedCollectionItem = instruction(
  {
    d1: '0x1f',
  },
  {
    metadata: 0,
    collectionAuthority: 1,
    payer: 2,
    collectionMint: 3,
    collection: 4,
    collectionMasterEditionAccount: 5,
    collectionAuthorityRecord: 6,
  },
  unit,
)

export type SetAndVerifySizedCollectionItem = undefined

export const setAndVerifySizedCollectionItem = instruction(
  {
    d1: '0x20',
  },
  {
    metadata: 0,
    collectionAuthority: 1,
    payer: 2,
    updateAuthority: 3,
    collectionMint: 4,
    collection: 5,
    collectionMasterEditionAccount: 6,
    collectionAuthorityRecord: 7,
  },
  unit,
)

export interface CreateMetadataAccountV3 {
  createMetadataAccountArgsV3: CreateMetadataAccountArgsV3
}

export const createMetadataAccountV3 = instruction(
  {
    d1: '0x21',
  },
  {
    metadata: 0,
    mint: 1,
    mintAuthority: 2,
    payer: 3,
    updateAuthority: 4,
    systemProgram: 5,
    rent: 6,
  },
  struct({
    createMetadataAccountArgsV3: CreateMetadataAccountArgsV3,
  }),
)

export interface SetCollectionSize {
  setCollectionSizeArgs: SetCollectionSizeArgs
}

export const setCollectionSize = instruction(
  {
    d1: '0x22',
  },
  {
    collectionMetadata: 0,
    collectionAuthority: 1,
    collectionMint: 2,
    collectionAuthorityRecord: 3,
  },
  struct({
    setCollectionSizeArgs: SetCollectionSizeArgs,
  }),
)

export type SetTokenStandard = undefined

export const setTokenStandard = instruction(
  {
    d1: '0x23',
  },
  {
    metadata: 0,
    updateAuthority: 1,
    mint: 2,
    edition: 3,
  },
  unit,
)

export interface BubblegumSetCollectionSize {
  setCollectionSizeArgs: SetCollectionSizeArgs
}

export const bubblegumSetCollectionSize = instruction(
  {
    d1: '0x24',
  },
  {
    collectionMetadata: 0,
    collectionAuthority: 1,
    collectionMint: 2,
    bubblegumSigner: 3,
    collectionAuthorityRecord: 4,
  },
  struct({
    setCollectionSizeArgs: SetCollectionSizeArgs,
  }),
)

export type BurnEditionNft = undefined

export const burnEditionNft = instruction(
  {
    d1: '0x25',
  },
  {
    metadata: 0,
    owner: 1,
    printEditionMint: 2,
    masterEditionMint: 3,
    printEditionTokenAccount: 4,
    masterEditionTokenAccount: 5,
    masterEditionAccount: 6,
    printEditionAccount: 7,
    editionMarkerAccount: 8,
    splTokenProgram: 9,
  },
  unit,
)

export type CreateEscrowAccount = undefined

export const createEscrowAccount = instruction(
  {
    d1: '0x26',
  },
  {
    escrow: 0,
    metadata: 1,
    mint: 2,
    tokenAccount: 3,
    edition: 4,
    payer: 5,
    systemProgram: 6,
    sysvarInstructions: 7,
    authority: 8,
  },
  unit,
)

export type CloseEscrowAccount = undefined

export const closeEscrowAccount = instruction(
  {
    d1: '0x27',
  },
  {
    escrow: 0,
    metadata: 1,
    mint: 2,
    tokenAccount: 3,
    edition: 4,
    payer: 5,
    systemProgram: 6,
    sysvarInstructions: 7,
  },
  unit,
)

export interface TransferOutOfEscrow {
  transferOutOfEscrowArgs: TransferOutOfEscrowArgs
}

export const transferOutOfEscrow = instruction(
  {
    d1: '0x28',
  },
  {
    escrow: 0,
    metadata: 1,
    payer: 2,
    attributeMint: 3,
    attributeSrc: 4,
    attributeDst: 5,
    escrowMint: 6,
    escrowAccount: 7,
    systemProgram: 8,
    ataProgram: 9,
    tokenProgram: 10,
    sysvarInstructions: 11,
    authority: 12,
  },
  struct({
    transferOutOfEscrowArgs: TransferOutOfEscrowArgs,
  }),
)

export interface Burn {
  burnArgs: BurnArgs
}

export const burn = instruction(
  {
    d1: '0x29',
  },
  {
    authority: 0,
    collectionMetadata: 1,
    metadata: 2,
    edition: 3,
    mint: 4,
    token: 5,
    masterEdition: 6,
    masterEditionMint: 7,
    masterEditionToken: 8,
    editionMarker: 9,
    tokenRecord: 10,
    systemProgram: 11,
    sysvarInstructions: 12,
    splTokenProgram: 13,
  },
  struct({
    burnArgs: BurnArgs,
  }),
)

export interface Create {
  createArgs: CreateArgs
}

export const create = instruction(
  {
    d1: '0x2a',
  },
  {
    metadata: 0,
    masterEdition: 1,
    mint: 2,
    authority: 3,
    payer: 4,
    updateAuthority: 5,
    systemProgram: 6,
    sysvarInstructions: 7,
    splTokenProgram: 8,
  },
  struct({
    createArgs: CreateArgs,
  }),
)

export interface Mint {
  mintArgs: MintArgs
}

export const mint = instruction(
  {
    d1: '0x2b',
  },
  {
    token: 0,
    tokenOwner: 1,
    metadata: 2,
    masterEdition: 3,
    tokenRecord: 4,
    mint: 5,
    authority: 6,
    delegateRecord: 7,
    payer: 8,
    systemProgram: 9,
    sysvarInstructions: 10,
    splTokenProgram: 11,
    splAtaProgram: 12,
    authorizationRulesProgram: 13,
    authorizationRules: 14,
  },
  struct({
    mintArgs: MintArgs,
  }),
)

export interface Delegate {
  delegateArgs: DelegateArgs
}

export const delegate = instruction(
  {
    d1: '0x2c',
  },
  {
    delegateRecord: 0,
    delegate: 1,
    metadata: 2,
    masterEdition: 3,
    tokenRecord: 4,
    mint: 5,
    token: 6,
    authority: 7,
    payer: 8,
    systemProgram: 9,
    sysvarInstructions: 10,
    splTokenProgram: 11,
    authorizationRulesProgram: 12,
    authorizationRules: 13,
  },
  struct({
    delegateArgs: DelegateArgs,
  }),
)

export interface Revoke {
  revokeArgs: RevokeArgs
}

export const revoke = instruction(
  {
    d1: '0x2d',
  },
  {
    delegateRecord: 0,
    delegate: 1,
    metadata: 2,
    masterEdition: 3,
    tokenRecord: 4,
    mint: 5,
    token: 6,
    authority: 7,
    payer: 8,
    systemProgram: 9,
    sysvarInstructions: 10,
    splTokenProgram: 11,
    authorizationRulesProgram: 12,
    authorizationRules: 13,
  },
  struct({
    revokeArgs: RevokeArgs,
  }),
)

export interface Lock {
  lockArgs: LockArgs
}

export const lock = instruction(
  {
    d1: '0x2e',
  },
  {
    authority: 0,
    tokenOwner: 1,
    token: 2,
    mint: 3,
    metadata: 4,
    edition: 5,
    tokenRecord: 6,
    payer: 7,
    systemProgram: 8,
    sysvarInstructions: 9,
    splTokenProgram: 10,
    authorizationRulesProgram: 11,
    authorizationRules: 12,
  },
  struct({
    lockArgs: LockArgs,
  }),
)

export interface Unlock {
  unlockArgs: UnlockArgs
}

export const unlock = instruction(
  {
    d1: '0x2f',
  },
  {
    authority: 0,
    tokenOwner: 1,
    token: 2,
    mint: 3,
    metadata: 4,
    edition: 5,
    tokenRecord: 6,
    payer: 7,
    systemProgram: 8,
    sysvarInstructions: 9,
    splTokenProgram: 10,
    authorizationRulesProgram: 11,
    authorizationRules: 12,
  },
  struct({
    unlockArgs: UnlockArgs,
  }),
)

export type Migrate = undefined

export const migrate = instruction(
  {
    d1: '0x30',
  },
  {
    metadata: 0,
    edition: 1,
    token: 2,
    tokenOwner: 3,
    mint: 4,
    payer: 5,
    authority: 6,
    collectionMetadata: 7,
    delegateRecord: 8,
    tokenRecord: 9,
    systemProgram: 10,
    sysvarInstructions: 11,
    splTokenProgram: 12,
    authorizationRulesProgram: 13,
    authorizationRules: 14,
  },
  unit,
)

export interface Transfer {
  transferArgs: TransferArgs
}

export const transfer = instruction(
  {
    d1: '0x31',
  },
  {
    token: 0,
    tokenOwner: 1,
    destination: 2,
    destinationOwner: 3,
    mint: 4,
    metadata: 5,
    edition: 6,
    ownerTokenRecord: 7,
    destinationTokenRecord: 8,
    authority: 9,
    payer: 10,
    systemProgram: 11,
    sysvarInstructions: 12,
    splTokenProgram: 13,
    splAtaProgram: 14,
    authorizationRulesProgram: 15,
    authorizationRules: 16,
  },
  struct({
    transferArgs: TransferArgs,
  }),
)

export interface Update {
  updateArgs: UpdateArgs
}

export const update = instruction(
  {
    d1: '0x32',
  },
  {
    authority: 0,
    delegateRecord: 1,
    token: 2,
    mint: 3,
    metadata: 4,
    edition: 5,
    payer: 6,
    systemProgram: 7,
    sysvarInstructions: 8,
    authorizationRulesProgram: 9,
    authorizationRules: 10,
  },
  struct({
    updateArgs: UpdateArgs,
  }),
)

export interface Use {
  useArgs: UseArgs
}

export const use = instruction(
  {
    d1: '0x33',
  },
  {
    authority: 0,
    delegateRecord: 1,
    token: 2,
    mint: 3,
    metadata: 4,
    edition: 5,
    payer: 6,
    systemProgram: 7,
    sysvarInstructions: 8,
    splTokenProgram: 9,
    authorizationRulesProgram: 10,
    authorizationRules: 11,
  },
  struct({
    useArgs: UseArgs,
  }),
)

export interface Verify {
  verificationArgs: VerificationArgs
}

export const verify = instruction(
  {
    d1: '0x34',
  },
  {
    authority: 0,
    delegateRecord: 1,
    metadata: 2,
    collectionMint: 3,
    collectionMetadata: 4,
    collectionMasterEdition: 5,
    systemProgram: 6,
    sysvarInstructions: 7,
  },
  struct({
    verificationArgs: VerificationArgs,
  }),
)

export interface Unverify {
  verificationArgs: VerificationArgs
}

export const unverify = instruction(
  {
    d1: '0x35',
  },
  {
    authority: 0,
    delegateRecord: 1,
    metadata: 2,
    collectionMint: 3,
    collectionMetadata: 4,
    systemProgram: 5,
    sysvarInstructions: 6,
  },
  struct({
    verificationArgs: VerificationArgs,
  }),
)

export type Collect = undefined

export const collect = instruction(
  {
    d1: '0x36',
  },
  {
    authority: 0,
    pdaAccount: 1,
  },
  unit,
)

export interface Print {
  printArgs: PrintArgs
}

export const print = instruction(
  {
    d1: '0x37',
  },
  {
    editionMetadata: 0,
    edition: 1,
    editionMint: 2,
    editionTokenAccountOwner: 3,
    editionTokenAccount: 4,
    editionMintAuthority: 5,
    editionTokenRecord: 6,
    masterEdition: 7,
    editionMarkerPda: 8,
    payer: 9,
    masterTokenAccountOwner: 10,
    masterTokenAccount: 11,
    masterMetadata: 12,
    updateAuthority: 13,
    splTokenProgram: 14,
    splAtaProgram: 15,
    sysvarInstructions: 16,
    systemProgram: 17,
  },
  struct({
    printArgs: PrintArgs,
  }),
)
