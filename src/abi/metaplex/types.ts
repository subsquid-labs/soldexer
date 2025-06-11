import {
  Codec,
  struct,
  u64,
  ref,
  bool,
  option,
  address,
  array,
  string,
  u16,
  u8,
  binary,
  fixedArray,
  hashMap,
  sum,
  unit,
  tuple,
} from '@subsquid/borsh';

export interface SetCollectionSizeArgs {
  size: bigint;
}

export const SetCollectionSizeArgs: Codec<SetCollectionSizeArgs> = struct({
  size: u64,
});

export interface CreateMetadataAccountArgsV2 {
  data: DataV2;
  isMutable: boolean;
}

export const CreateMetadataAccountArgsV2: Codec<CreateMetadataAccountArgsV2> = struct({
  data: ref(() => DataV2),
  isMutable: bool,
});

export interface CreateMetadataAccountArgs {
  data: Data;
  isMutable: boolean;
}

export const CreateMetadataAccountArgs: Codec<CreateMetadataAccountArgs> = struct({
  data: ref(() => Data),
  isMutable: bool,
});

export interface UpdateMetadataAccountArgs {
  data?: Data | undefined;
  updateAuthority?: string | undefined;
  primarySaleHappened?: boolean | undefined;
}

export const UpdateMetadataAccountArgs: Codec<UpdateMetadataAccountArgs> = struct({
  data: option(ref(() => Data)),
  updateAuthority: option(address),
  primarySaleHappened: option(bool),
});

export interface MintPrintingTokensViaTokenArgs {
  supply: bigint;
}

export const MintPrintingTokensViaTokenArgs: Codec<MintPrintingTokensViaTokenArgs> = struct({
  supply: u64,
});

export interface SetReservationListArgs {
  reservations: Array<Reservation>;
  totalReservationSpots?: bigint | undefined;
  offset: bigint;
  totalSpotOffset: bigint;
}

export const SetReservationListArgs: Codec<SetReservationListArgs> = struct({
  reservations: array(ref(() => Reservation)),
  totalReservationSpots: option(u64),
  offset: u64,
  totalSpotOffset: u64,
});

export interface CreateMasterEditionArgs {
  maxSupply?: bigint | undefined;
}

export const CreateMasterEditionArgs: Codec<CreateMasterEditionArgs> = struct({
  maxSupply: option(u64),
});

export interface MintNewEditionFromMasterEditionViaTokenArgs {
  edition: bigint;
}

export const MintNewEditionFromMasterEditionViaTokenArgs: Codec<MintNewEditionFromMasterEditionViaTokenArgs> =
  struct({
    edition: u64,
  });

export interface TransferOutOfEscrowArgs {
  amount: bigint;
}

export const TransferOutOfEscrowArgs: Codec<TransferOutOfEscrowArgs> = struct({
  amount: u64,
});

export interface CreateMetadataAccountArgsV3 {
  data: DataV2;
  isMutable: boolean;
  collectionDetails?: CollectionDetails | undefined;
}

export const CreateMetadataAccountArgsV3: Codec<CreateMetadataAccountArgsV3> = struct({
  data: ref(() => DataV2),
  isMutable: bool,
  collectionDetails: option(ref(() => CollectionDetails)),
});

export interface UpdateMetadataAccountArgsV2 {
  data?: DataV2 | undefined;
  updateAuthority?: string | undefined;
  primarySaleHappened?: boolean | undefined;
  isMutable?: boolean | undefined;
}

export const UpdateMetadataAccountArgsV2: Codec<UpdateMetadataAccountArgsV2> = struct({
  data: option(ref(() => DataV2)),
  updateAuthority: option(address),
  primarySaleHappened: option(bool),
  isMutable: option(bool),
});

export interface ApproveUseAuthorityArgs {
  numberOfUses: bigint;
}

export const ApproveUseAuthorityArgs: Codec<ApproveUseAuthorityArgs> = struct({
  numberOfUses: u64,
});

export interface UtilizeArgs {
  numberOfUses: bigint;
}

export const UtilizeArgs: Codec<UtilizeArgs> = struct({
  numberOfUses: u64,
});

export interface AuthorizationData {
  payload: Payload;
}

export const AuthorizationData: Codec<AuthorizationData> = struct({
  payload: ref(() => Payload),
});

export interface AssetData {
  name: string;
  symbol: string;
  uri: string;
  sellerFeeBasisPoints: number;
  creators?: Array<Creator> | undefined;
  primarySaleHappened: boolean;
  isMutable: boolean;
  tokenStandard: TokenStandard;
  collection?: Collection | undefined;
  uses?: Uses | undefined;
  collectionDetails?: CollectionDetails | undefined;
  ruleSet?: string | undefined;
}

export const AssetData: Codec<AssetData> = struct({
  name: string,
  symbol: string,
  uri: string,
  sellerFeeBasisPoints: u16,
  creators: option(array(ref(() => Creator))),
  primarySaleHappened: bool,
  isMutable: bool,
  tokenStandard: ref(() => TokenStandard),
  collection: option(ref(() => Collection)),
  uses: option(ref(() => Uses)),
  collectionDetails: option(ref(() => CollectionDetails)),
  ruleSet: option(address),
});

export interface Collection {
  verified: boolean;
  key: string;
}

export const Collection: Codec<Collection> = struct({
  verified: bool,
  key: address,
});

export interface Creator {
  address: string;
  verified: boolean;
  share: number;
}

export const Creator: Codec<Creator> = struct({
  address: address,
  verified: bool,
  share: u8,
});

export interface Data {
  name: string;
  symbol: string;
  uri: string;
  sellerFeeBasisPoints: number;
  creators?: Array<Creator> | undefined;
}

export const Data: Codec<Data> = struct({
  name: string,
  symbol: string,
  uri: string,
  sellerFeeBasisPoints: u16,
  creators: option(array(ref(() => Creator))),
});

export interface DataV2 {
  name: string;
  symbol: string;
  uri: string;
  sellerFeeBasisPoints: number;
  creators?: Array<Creator> | undefined;
  collection?: Collection | undefined;
  uses?: Uses | undefined;
}

export const DataV2: Codec<DataV2> = struct({
  name: string,
  symbol: string,
  uri: string,
  sellerFeeBasisPoints: u16,
  creators: option(array(ref(() => Creator))),
  collection: option(ref(() => Collection)),
  uses: option(ref(() => Uses)),
});

export interface Reservation {
  address: string;
  spotsRemaining: bigint;
  totalSpots: bigint;
}

export const Reservation: Codec<Reservation> = struct({
  address: address,
  spotsRemaining: u64,
  totalSpots: u64,
});

export interface ReservationV1 {
  address: string;
  spotsRemaining: number;
  totalSpots: number;
}

export const ReservationV1: Codec<ReservationV1> = struct({
  address: address,
  spotsRemaining: u8,
  totalSpots: u8,
});

export interface SeedsVec {
  seeds: Array<Uint8Array>;
}

export const SeedsVec: Codec<SeedsVec> = struct({
  seeds: array(binary),
});

export interface LeafInfo {
  leaf: Array<number>;
  proof: Array<Array<number>>;
}

export const LeafInfo: Codec<LeafInfo> = struct({
  leaf: fixedArray(u8, 32),
  proof: array(fixedArray(u8, 32)),
});

export interface Payload {
  map: Map<string, PayloadType>;
}

export const Payload: Codec<Payload> = struct({
  map: hashMap(
    string,
    ref(() => PayloadType),
  ),
});

export interface Uses {
  useMethod: UseMethod;
  remaining: bigint;
  total: bigint;
}

export const Uses: Codec<Uses> = struct({
  useMethod: ref(() => UseMethod),
  remaining: u64,
  total: u64,
});

export type BurnArgs_V1 = {
  amount: bigint;
};

export const BurnArgs_V1 = struct({
  amount: u64,
});

export type BurnArgs = {
  kind: 'V1';
  value: BurnArgs_V1;
};

export const BurnArgs: Codec<BurnArgs> = sum(1, {
  V1: {
    discriminator: 0,
    value: BurnArgs_V1,
  },
});

export type DelegateArgs_CollectionV1 = {
  authorizationData?: AuthorizationData | undefined;
};

export const DelegateArgs_CollectionV1 = struct({
  authorizationData: option(ref(() => AuthorizationData)),
});

export type DelegateArgs_SaleV1 = {
  amount: bigint;
  authorizationData?: AuthorizationData | undefined;
};

export const DelegateArgs_SaleV1 = struct({
  amount: u64,
  authorizationData: option(ref(() => AuthorizationData)),
});

export type DelegateArgs_TransferV1 = {
  amount: bigint;
  authorizationData?: AuthorizationData | undefined;
};

export const DelegateArgs_TransferV1 = struct({
  amount: u64,
  authorizationData: option(ref(() => AuthorizationData)),
});

export type DelegateArgs_DataV1 = {
  authorizationData?: AuthorizationData | undefined;
};

export const DelegateArgs_DataV1 = struct({
  authorizationData: option(ref(() => AuthorizationData)),
});

export type DelegateArgs_UtilityV1 = {
  amount: bigint;
  authorizationData?: AuthorizationData | undefined;
};

export const DelegateArgs_UtilityV1 = struct({
  amount: u64,
  authorizationData: option(ref(() => AuthorizationData)),
});

export type DelegateArgs_StakingV1 = {
  amount: bigint;
  authorizationData?: AuthorizationData | undefined;
};

export const DelegateArgs_StakingV1 = struct({
  amount: u64,
  authorizationData: option(ref(() => AuthorizationData)),
});

export type DelegateArgs_StandardV1 = {
  amount: bigint;
};

export const DelegateArgs_StandardV1 = struct({
  amount: u64,
});

export type DelegateArgs_LockedTransferV1 = {
  amount: bigint;
  lockedAddress: string;
  authorizationData?: AuthorizationData | undefined;
};

export const DelegateArgs_LockedTransferV1 = struct({
  amount: u64,
  lockedAddress: address,
  authorizationData: option(ref(() => AuthorizationData)),
});

export type DelegateArgs_ProgrammableConfigV1 = {
  authorizationData?: AuthorizationData | undefined;
};

export const DelegateArgs_ProgrammableConfigV1 = struct({
  authorizationData: option(ref(() => AuthorizationData)),
});

export type DelegateArgs_AuthorityItemV1 = {
  authorizationData?: AuthorizationData | undefined;
};

export const DelegateArgs_AuthorityItemV1 = struct({
  authorizationData: option(ref(() => AuthorizationData)),
});

export type DelegateArgs_DataItemV1 = {
  authorizationData?: AuthorizationData | undefined;
};

export const DelegateArgs_DataItemV1 = struct({
  authorizationData: option(ref(() => AuthorizationData)),
});

export type DelegateArgs_CollectionItemV1 = {
  authorizationData?: AuthorizationData | undefined;
};

export const DelegateArgs_CollectionItemV1 = struct({
  authorizationData: option(ref(() => AuthorizationData)),
});

export type DelegateArgs_ProgrammableConfigItemV1 = {
  authorizationData?: AuthorizationData | undefined;
};

export const DelegateArgs_ProgrammableConfigItemV1 = struct({
  authorizationData: option(ref(() => AuthorizationData)),
});

export type DelegateArgs =
  | {
      kind: 'CollectionV1';
      value: DelegateArgs_CollectionV1;
    }
  | {
      kind: 'SaleV1';
      value: DelegateArgs_SaleV1;
    }
  | {
      kind: 'TransferV1';
      value: DelegateArgs_TransferV1;
    }
  | {
      kind: 'DataV1';
      value: DelegateArgs_DataV1;
    }
  | {
      kind: 'UtilityV1';
      value: DelegateArgs_UtilityV1;
    }
  | {
      kind: 'StakingV1';
      value: DelegateArgs_StakingV1;
    }
  | {
      kind: 'StandardV1';
      value: DelegateArgs_StandardV1;
    }
  | {
      kind: 'LockedTransferV1';
      value: DelegateArgs_LockedTransferV1;
    }
  | {
      kind: 'ProgrammableConfigV1';
      value: DelegateArgs_ProgrammableConfigV1;
    }
  | {
      kind: 'AuthorityItemV1';
      value: DelegateArgs_AuthorityItemV1;
    }
  | {
      kind: 'DataItemV1';
      value: DelegateArgs_DataItemV1;
    }
  | {
      kind: 'CollectionItemV1';
      value: DelegateArgs_CollectionItemV1;
    }
  | {
      kind: 'ProgrammableConfigItemV1';
      value: DelegateArgs_ProgrammableConfigItemV1;
    };

export const DelegateArgs: Codec<DelegateArgs> = sum(1, {
  CollectionV1: {
    discriminator: 0,
    value: DelegateArgs_CollectionV1,
  },
  SaleV1: {
    discriminator: 1,
    value: DelegateArgs_SaleV1,
  },
  TransferV1: {
    discriminator: 2,
    value: DelegateArgs_TransferV1,
  },
  DataV1: {
    discriminator: 3,
    value: DelegateArgs_DataV1,
  },
  UtilityV1: {
    discriminator: 4,
    value: DelegateArgs_UtilityV1,
  },
  StakingV1: {
    discriminator: 5,
    value: DelegateArgs_StakingV1,
  },
  StandardV1: {
    discriminator: 6,
    value: DelegateArgs_StandardV1,
  },
  LockedTransferV1: {
    discriminator: 7,
    value: DelegateArgs_LockedTransferV1,
  },
  ProgrammableConfigV1: {
    discriminator: 8,
    value: DelegateArgs_ProgrammableConfigV1,
  },
  AuthorityItemV1: {
    discriminator: 9,
    value: DelegateArgs_AuthorityItemV1,
  },
  DataItemV1: {
    discriminator: 10,
    value: DelegateArgs_DataItemV1,
  },
  CollectionItemV1: {
    discriminator: 11,
    value: DelegateArgs_CollectionItemV1,
  },
  ProgrammableConfigItemV1: {
    discriminator: 12,
    value: DelegateArgs_ProgrammableConfigItemV1,
  },
});

export type RevokeArgs_CollectionV1 = undefined;

export const RevokeArgs_CollectionV1 = unit;

export type RevokeArgs_SaleV1 = undefined;

export const RevokeArgs_SaleV1 = unit;

export type RevokeArgs_TransferV1 = undefined;

export const RevokeArgs_TransferV1 = unit;

export type RevokeArgs_DataV1 = undefined;

export const RevokeArgs_DataV1 = unit;

export type RevokeArgs_UtilityV1 = undefined;

export const RevokeArgs_UtilityV1 = unit;

export type RevokeArgs_StakingV1 = undefined;

export const RevokeArgs_StakingV1 = unit;

export type RevokeArgs_StandardV1 = undefined;

export const RevokeArgs_StandardV1 = unit;

export type RevokeArgs_LockedTransferV1 = undefined;

export const RevokeArgs_LockedTransferV1 = unit;

export type RevokeArgs_ProgrammableConfigV1 = undefined;

export const RevokeArgs_ProgrammableConfigV1 = unit;

export type RevokeArgs_MigrationV1 = undefined;

export const RevokeArgs_MigrationV1 = unit;

export type RevokeArgs_AuthorityItemV1 = undefined;

export const RevokeArgs_AuthorityItemV1 = unit;

export type RevokeArgs_DataItemV1 = undefined;

export const RevokeArgs_DataItemV1 = unit;

export type RevokeArgs_CollectionItemV1 = undefined;

export const RevokeArgs_CollectionItemV1 = unit;

export type RevokeArgs_ProgrammableConfigItemV1 = undefined;

export const RevokeArgs_ProgrammableConfigItemV1 = unit;

export type RevokeArgs =
  | {
      kind: 'CollectionV1';
      value?: RevokeArgs_CollectionV1;
    }
  | {
      kind: 'SaleV1';
      value?: RevokeArgs_SaleV1;
    }
  | {
      kind: 'TransferV1';
      value?: RevokeArgs_TransferV1;
    }
  | {
      kind: 'DataV1';
      value?: RevokeArgs_DataV1;
    }
  | {
      kind: 'UtilityV1';
      value?: RevokeArgs_UtilityV1;
    }
  | {
      kind: 'StakingV1';
      value?: RevokeArgs_StakingV1;
    }
  | {
      kind: 'StandardV1';
      value?: RevokeArgs_StandardV1;
    }
  | {
      kind: 'LockedTransferV1';
      value?: RevokeArgs_LockedTransferV1;
    }
  | {
      kind: 'ProgrammableConfigV1';
      value?: RevokeArgs_ProgrammableConfigV1;
    }
  | {
      kind: 'MigrationV1';
      value?: RevokeArgs_MigrationV1;
    }
  | {
      kind: 'AuthorityItemV1';
      value?: RevokeArgs_AuthorityItemV1;
    }
  | {
      kind: 'DataItemV1';
      value?: RevokeArgs_DataItemV1;
    }
  | {
      kind: 'CollectionItemV1';
      value?: RevokeArgs_CollectionItemV1;
    }
  | {
      kind: 'ProgrammableConfigItemV1';
      value?: RevokeArgs_ProgrammableConfigItemV1;
    };

export const RevokeArgs: Codec<RevokeArgs> = sum(1, {
  CollectionV1: {
    discriminator: 0,
    value: RevokeArgs_CollectionV1,
  },
  SaleV1: {
    discriminator: 1,
    value: RevokeArgs_SaleV1,
  },
  TransferV1: {
    discriminator: 2,
    value: RevokeArgs_TransferV1,
  },
  DataV1: {
    discriminator: 3,
    value: RevokeArgs_DataV1,
  },
  UtilityV1: {
    discriminator: 4,
    value: RevokeArgs_UtilityV1,
  },
  StakingV1: {
    discriminator: 5,
    value: RevokeArgs_StakingV1,
  },
  StandardV1: {
    discriminator: 6,
    value: RevokeArgs_StandardV1,
  },
  LockedTransferV1: {
    discriminator: 7,
    value: RevokeArgs_LockedTransferV1,
  },
  ProgrammableConfigV1: {
    discriminator: 8,
    value: RevokeArgs_ProgrammableConfigV1,
  },
  MigrationV1: {
    discriminator: 9,
    value: RevokeArgs_MigrationV1,
  },
  AuthorityItemV1: {
    discriminator: 10,
    value: RevokeArgs_AuthorityItemV1,
  },
  DataItemV1: {
    discriminator: 11,
    value: RevokeArgs_DataItemV1,
  },
  CollectionItemV1: {
    discriminator: 12,
    value: RevokeArgs_CollectionItemV1,
  },
  ProgrammableConfigItemV1: {
    discriminator: 13,
    value: RevokeArgs_ProgrammableConfigItemV1,
  },
});

export type MetadataDelegateRole_AuthorityItem = undefined;

export const MetadataDelegateRole_AuthorityItem = unit;

export type MetadataDelegateRole_Collection = undefined;

export const MetadataDelegateRole_Collection = unit;

export type MetadataDelegateRole_Use = undefined;

export const MetadataDelegateRole_Use = unit;

export type MetadataDelegateRole_Data = undefined;

export const MetadataDelegateRole_Data = unit;

export type MetadataDelegateRole_ProgrammableConfig = undefined;

export const MetadataDelegateRole_ProgrammableConfig = unit;

export type MetadataDelegateRole_DataItem = undefined;

export const MetadataDelegateRole_DataItem = unit;

export type MetadataDelegateRole_CollectionItem = undefined;

export const MetadataDelegateRole_CollectionItem = unit;

export type MetadataDelegateRole_ProgrammableConfigItem = undefined;

export const MetadataDelegateRole_ProgrammableConfigItem = unit;

export type MetadataDelegateRole =
  | {
      kind: 'AuthorityItem';
      value?: MetadataDelegateRole_AuthorityItem;
    }
  | {
      kind: 'Collection';
      value?: MetadataDelegateRole_Collection;
    }
  | {
      kind: 'Use';
      value?: MetadataDelegateRole_Use;
    }
  | {
      kind: 'Data';
      value?: MetadataDelegateRole_Data;
    }
  | {
      kind: 'ProgrammableConfig';
      value?: MetadataDelegateRole_ProgrammableConfig;
    }
  | {
      kind: 'DataItem';
      value?: MetadataDelegateRole_DataItem;
    }
  | {
      kind: 'CollectionItem';
      value?: MetadataDelegateRole_CollectionItem;
    }
  | {
      kind: 'ProgrammableConfigItem';
      value?: MetadataDelegateRole_ProgrammableConfigItem;
    };

export const MetadataDelegateRole: Codec<MetadataDelegateRole> = sum(1, {
  AuthorityItem: {
    discriminator: 0,
    value: MetadataDelegateRole_AuthorityItem,
  },
  Collection: {
    discriminator: 1,
    value: MetadataDelegateRole_Collection,
  },
  Use: {
    discriminator: 2,
    value: MetadataDelegateRole_Use,
  },
  Data: {
    discriminator: 3,
    value: MetadataDelegateRole_Data,
  },
  ProgrammableConfig: {
    discriminator: 4,
    value: MetadataDelegateRole_ProgrammableConfig,
  },
  DataItem: {
    discriminator: 5,
    value: MetadataDelegateRole_DataItem,
  },
  CollectionItem: {
    discriminator: 6,
    value: MetadataDelegateRole_CollectionItem,
  },
  ProgrammableConfigItem: {
    discriminator: 7,
    value: MetadataDelegateRole_ProgrammableConfigItem,
  },
});

export type CreateArgs_V1 = {
  assetData: AssetData;
  decimals?: number | undefined;
  printSupply?: PrintSupply | undefined;
};

export const CreateArgs_V1 = struct({
  assetData: ref(() => AssetData),
  decimals: option(u8),
  printSupply: option(ref(() => PrintSupply)),
});

export type CreateArgs = {
  kind: 'V1';
  value: CreateArgs_V1;
};

export const CreateArgs: Codec<CreateArgs> = sum(1, {
  V1: {
    discriminator: 0,
    value: CreateArgs_V1,
  },
});

export type MintArgs_V1 = {
  amount: bigint;
  authorizationData?: AuthorizationData | undefined;
};

export const MintArgs_V1 = struct({
  amount: u64,
  authorizationData: option(ref(() => AuthorizationData)),
});

export type MintArgs = {
  kind: 'V1';
  value: MintArgs_V1;
};

export const MintArgs: Codec<MintArgs> = sum(1, {
  V1: {
    discriminator: 0,
    value: MintArgs_V1,
  },
});

export type TransferArgs_V1 = {
  amount: bigint;
  authorizationData?: AuthorizationData | undefined;
};

export const TransferArgs_V1 = struct({
  amount: u64,
  authorizationData: option(ref(() => AuthorizationData)),
});

export type TransferArgs = {
  kind: 'V1';
  value: TransferArgs_V1;
};

export const TransferArgs: Codec<TransferArgs> = sum(1, {
  V1: {
    discriminator: 0,
    value: TransferArgs_V1,
  },
});

export type UpdateArgs_V1 = {
  newUpdateAuthority?: string | undefined;
  data?: Data | undefined;
  primarySaleHappened?: boolean | undefined;
  isMutable?: boolean | undefined;
  collection: CollectionToggle;
  collectionDetails: CollectionDetailsToggle;
  uses: UsesToggle;
  ruleSet: RuleSetToggle;
  authorizationData?: AuthorizationData | undefined;
};

export const UpdateArgs_V1 = struct({
  newUpdateAuthority: option(address),
  data: option(ref(() => Data)),
  primarySaleHappened: option(bool),
  isMutable: option(bool),
  collection: ref(() => CollectionToggle),
  collectionDetails: ref(() => CollectionDetailsToggle),
  uses: ref(() => UsesToggle),
  ruleSet: ref(() => RuleSetToggle),
  authorizationData: option(ref(() => AuthorizationData)),
});

export type UpdateArgs_AsUpdateAuthorityV2 = {
  newUpdateAuthority?: string | undefined;
  data?: Data | undefined;
  primarySaleHappened?: boolean | undefined;
  isMutable?: boolean | undefined;
  collection: CollectionToggle;
  collectionDetails: CollectionDetailsToggle;
  uses: UsesToggle;
  ruleSet: RuleSetToggle;
  tokenStandard?: TokenStandard | undefined;
  authorizationData?: AuthorizationData | undefined;
};

export const UpdateArgs_AsUpdateAuthorityV2 = struct({
  newUpdateAuthority: option(address),
  data: option(ref(() => Data)),
  primarySaleHappened: option(bool),
  isMutable: option(bool),
  collection: ref(() => CollectionToggle),
  collectionDetails: ref(() => CollectionDetailsToggle),
  uses: ref(() => UsesToggle),
  ruleSet: ref(() => RuleSetToggle),
  tokenStandard: option(ref(() => TokenStandard)),
  authorizationData: option(ref(() => AuthorizationData)),
});

export type UpdateArgs_AsAuthorityItemDelegateV2 = {
  newUpdateAuthority?: string | undefined;
  primarySaleHappened?: boolean | undefined;
  isMutable?: boolean | undefined;
  tokenStandard?: TokenStandard | undefined;
  authorizationData?: AuthorizationData | undefined;
};

export const UpdateArgs_AsAuthorityItemDelegateV2 = struct({
  newUpdateAuthority: option(address),
  primarySaleHappened: option(bool),
  isMutable: option(bool),
  tokenStandard: option(ref(() => TokenStandard)),
  authorizationData: option(ref(() => AuthorizationData)),
});

export type UpdateArgs_AsCollectionDelegateV2 = {
  collection: CollectionToggle;
  authorizationData?: AuthorizationData | undefined;
};

export const UpdateArgs_AsCollectionDelegateV2 = struct({
  collection: ref(() => CollectionToggle),
  authorizationData: option(ref(() => AuthorizationData)),
});

export type UpdateArgs_AsDataDelegateV2 = {
  data?: Data | undefined;
  authorizationData?: AuthorizationData | undefined;
};

export const UpdateArgs_AsDataDelegateV2 = struct({
  data: option(ref(() => Data)),
  authorizationData: option(ref(() => AuthorizationData)),
});

export type UpdateArgs_AsProgrammableConfigDelegateV2 = {
  ruleSet: RuleSetToggle;
  authorizationData?: AuthorizationData | undefined;
};

export const UpdateArgs_AsProgrammableConfigDelegateV2 = struct({
  ruleSet: ref(() => RuleSetToggle),
  authorizationData: option(ref(() => AuthorizationData)),
});

export type UpdateArgs_AsDataItemDelegateV2 = {
  data?: Data | undefined;
  authorizationData?: AuthorizationData | undefined;
};

export const UpdateArgs_AsDataItemDelegateV2 = struct({
  data: option(ref(() => Data)),
  authorizationData: option(ref(() => AuthorizationData)),
});

export type UpdateArgs_AsCollectionItemDelegateV2 = {
  collection: CollectionToggle;
  authorizationData?: AuthorizationData | undefined;
};

export const UpdateArgs_AsCollectionItemDelegateV2 = struct({
  collection: ref(() => CollectionToggle),
  authorizationData: option(ref(() => AuthorizationData)),
});

export type UpdateArgs_AsProgrammableConfigItemDelegateV2 = {
  ruleSet: RuleSetToggle;
  authorizationData?: AuthorizationData | undefined;
};

export const UpdateArgs_AsProgrammableConfigItemDelegateV2 = struct({
  ruleSet: ref(() => RuleSetToggle),
  authorizationData: option(ref(() => AuthorizationData)),
});

export type UpdateArgs =
  | {
      kind: 'V1';
      value: UpdateArgs_V1;
    }
  | {
      kind: 'AsUpdateAuthorityV2';
      value: UpdateArgs_AsUpdateAuthorityV2;
    }
  | {
      kind: 'AsAuthorityItemDelegateV2';
      value: UpdateArgs_AsAuthorityItemDelegateV2;
    }
  | {
      kind: 'AsCollectionDelegateV2';
      value: UpdateArgs_AsCollectionDelegateV2;
    }
  | {
      kind: 'AsDataDelegateV2';
      value: UpdateArgs_AsDataDelegateV2;
    }
  | {
      kind: 'AsProgrammableConfigDelegateV2';
      value: UpdateArgs_AsProgrammableConfigDelegateV2;
    }
  | {
      kind: 'AsDataItemDelegateV2';
      value: UpdateArgs_AsDataItemDelegateV2;
    }
  | {
      kind: 'AsCollectionItemDelegateV2';
      value: UpdateArgs_AsCollectionItemDelegateV2;
    }
  | {
      kind: 'AsProgrammableConfigItemDelegateV2';
      value: UpdateArgs_AsProgrammableConfigItemDelegateV2;
    };

export const UpdateArgs: Codec<UpdateArgs> = sum(1, {
  V1: {
    discriminator: 0,
    value: UpdateArgs_V1,
  },
  AsUpdateAuthorityV2: {
    discriminator: 1,
    value: UpdateArgs_AsUpdateAuthorityV2,
  },
  AsAuthorityItemDelegateV2: {
    discriminator: 2,
    value: UpdateArgs_AsAuthorityItemDelegateV2,
  },
  AsCollectionDelegateV2: {
    discriminator: 3,
    value: UpdateArgs_AsCollectionDelegateV2,
  },
  AsDataDelegateV2: {
    discriminator: 4,
    value: UpdateArgs_AsDataDelegateV2,
  },
  AsProgrammableConfigDelegateV2: {
    discriminator: 5,
    value: UpdateArgs_AsProgrammableConfigDelegateV2,
  },
  AsDataItemDelegateV2: {
    discriminator: 6,
    value: UpdateArgs_AsDataItemDelegateV2,
  },
  AsCollectionItemDelegateV2: {
    discriminator: 7,
    value: UpdateArgs_AsCollectionItemDelegateV2,
  },
  AsProgrammableConfigItemDelegateV2: {
    discriminator: 8,
    value: UpdateArgs_AsProgrammableConfigItemDelegateV2,
  },
});

export type CollectionToggle_None = undefined;

export const CollectionToggle_None = unit;

export type CollectionToggle_Clear = undefined;

export const CollectionToggle_Clear = unit;

export type CollectionToggle_Set = [Collection];

export const CollectionToggle_Set = tuple([ref(() => Collection)]);

export type CollectionToggle =
  | {
      kind: 'None';
      value?: CollectionToggle_None;
    }
  | {
      kind: 'Clear';
      value?: CollectionToggle_Clear;
    }
  | {
      kind: 'Set';
      value: CollectionToggle_Set;
    };

export const CollectionToggle: Codec<CollectionToggle> = sum(1, {
  None: {
    discriminator: 0,
    value: CollectionToggle_None,
  },
  Clear: {
    discriminator: 1,
    value: CollectionToggle_Clear,
  },
  Set: {
    discriminator: 2,
    value: CollectionToggle_Set,
  },
});

export type UsesToggle_None = undefined;

export const UsesToggle_None = unit;

export type UsesToggle_Clear = undefined;

export const UsesToggle_Clear = unit;

export type UsesToggle_Set = [Uses];

export const UsesToggle_Set = tuple([ref(() => Uses)]);

export type UsesToggle =
  | {
      kind: 'None';
      value?: UsesToggle_None;
    }
  | {
      kind: 'Clear';
      value?: UsesToggle_Clear;
    }
  | {
      kind: 'Set';
      value: UsesToggle_Set;
    };

export const UsesToggle: Codec<UsesToggle> = sum(1, {
  None: {
    discriminator: 0,
    value: UsesToggle_None,
  },
  Clear: {
    discriminator: 1,
    value: UsesToggle_Clear,
  },
  Set: {
    discriminator: 2,
    value: UsesToggle_Set,
  },
});

export type CollectionDetailsToggle_None = undefined;

export const CollectionDetailsToggle_None = unit;

export type CollectionDetailsToggle_Clear = undefined;

export const CollectionDetailsToggle_Clear = unit;

export type CollectionDetailsToggle_Set = [CollectionDetails];

export const CollectionDetailsToggle_Set = tuple([ref(() => CollectionDetails)]);

export type CollectionDetailsToggle =
  | {
      kind: 'None';
      value?: CollectionDetailsToggle_None;
    }
  | {
      kind: 'Clear';
      value?: CollectionDetailsToggle_Clear;
    }
  | {
      kind: 'Set';
      value: CollectionDetailsToggle_Set;
    };

export const CollectionDetailsToggle: Codec<CollectionDetailsToggle> = sum(1, {
  None: {
    discriminator: 0,
    value: CollectionDetailsToggle_None,
  },
  Clear: {
    discriminator: 1,
    value: CollectionDetailsToggle_Clear,
  },
  Set: {
    discriminator: 2,
    value: CollectionDetailsToggle_Set,
  },
});

export type RuleSetToggle_None = undefined;

export const RuleSetToggle_None = unit;

export type RuleSetToggle_Clear = undefined;

export const RuleSetToggle_Clear = unit;

export type RuleSetToggle_Set = [string];

export const RuleSetToggle_Set = tuple([address]);

export type RuleSetToggle =
  | {
      kind: 'None';
      value?: RuleSetToggle_None;
    }
  | {
      kind: 'Clear';
      value?: RuleSetToggle_Clear;
    }
  | {
      kind: 'Set';
      value: RuleSetToggle_Set;
    };

export const RuleSetToggle: Codec<RuleSetToggle> = sum(1, {
  None: {
    discriminator: 0,
    value: RuleSetToggle_None,
  },
  Clear: {
    discriminator: 1,
    value: RuleSetToggle_Clear,
  },
  Set: {
    discriminator: 2,
    value: RuleSetToggle_Set,
  },
});

export type PrintArgs_V1 = {
  edition: bigint;
};

export const PrintArgs_V1 = struct({
  edition: u64,
});

export type PrintArgs = {
  kind: 'V1';
  value: PrintArgs_V1;
};

export const PrintArgs: Codec<PrintArgs> = sum(1, {
  V1: {
    discriminator: 0,
    value: PrintArgs_V1,
  },
});

export type LockArgs_V1 = {
  authorizationData?: AuthorizationData | undefined;
};

export const LockArgs_V1 = struct({
  authorizationData: option(ref(() => AuthorizationData)),
});

export type LockArgs = {
  kind: 'V1';
  value: LockArgs_V1;
};

export const LockArgs: Codec<LockArgs> = sum(1, {
  V1: {
    discriminator: 0,
    value: LockArgs_V1,
  },
});

export type UnlockArgs_V1 = {
  authorizationData?: AuthorizationData | undefined;
};

export const UnlockArgs_V1 = struct({
  authorizationData: option(ref(() => AuthorizationData)),
});

export type UnlockArgs = {
  kind: 'V1';
  value: UnlockArgs_V1;
};

export const UnlockArgs: Codec<UnlockArgs> = sum(1, {
  V1: {
    discriminator: 0,
    value: UnlockArgs_V1,
  },
});

export type UseArgs_V1 = {
  authorizationData?: AuthorizationData | undefined;
};

export const UseArgs_V1 = struct({
  authorizationData: option(ref(() => AuthorizationData)),
});

export type UseArgs = {
  kind: 'V1';
  value: UseArgs_V1;
};

export const UseArgs: Codec<UseArgs> = sum(1, {
  V1: {
    discriminator: 0,
    value: UseArgs_V1,
  },
});

export type VerificationArgs_CreatorV1 = undefined;

export const VerificationArgs_CreatorV1 = unit;

export type VerificationArgs_CollectionV1 = undefined;

export const VerificationArgs_CollectionV1 = unit;

export type VerificationArgs =
  | {
      kind: 'CreatorV1';
      value?: VerificationArgs_CreatorV1;
    }
  | {
      kind: 'CollectionV1';
      value?: VerificationArgs_CollectionV1;
    };

export const VerificationArgs: Codec<VerificationArgs> = sum(1, {
  CreatorV1: {
    discriminator: 0,
    value: VerificationArgs_CreatorV1,
  },
  CollectionV1: {
    discriminator: 1,
    value: VerificationArgs_CollectionV1,
  },
});

export type TokenStandard_NonFungible = undefined;

export const TokenStandard_NonFungible = unit;

export type TokenStandard_FungibleAsset = undefined;

export const TokenStandard_FungibleAsset = unit;

export type TokenStandard_Fungible = undefined;

export const TokenStandard_Fungible = unit;

export type TokenStandard_NonFungibleEdition = undefined;

export const TokenStandard_NonFungibleEdition = unit;

export type TokenStandard_ProgrammableNonFungible = undefined;

export const TokenStandard_ProgrammableNonFungible = unit;

export type TokenStandard_ProgrammableNonFungibleEdition = undefined;

export const TokenStandard_ProgrammableNonFungibleEdition = unit;

export type TokenStandard =
  | {
      kind: 'NonFungible';
      value?: TokenStandard_NonFungible;
    }
  | {
      kind: 'FungibleAsset';
      value?: TokenStandard_FungibleAsset;
    }
  | {
      kind: 'Fungible';
      value?: TokenStandard_Fungible;
    }
  | {
      kind: 'NonFungibleEdition';
      value?: TokenStandard_NonFungibleEdition;
    }
  | {
      kind: 'ProgrammableNonFungible';
      value?: TokenStandard_ProgrammableNonFungible;
    }
  | {
      kind: 'ProgrammableNonFungibleEdition';
      value?: TokenStandard_ProgrammableNonFungibleEdition;
    };

export const TokenStandard: Codec<TokenStandard> = sum(1, {
  NonFungible: {
    discriminator: 0,
    value: TokenStandard_NonFungible,
  },
  FungibleAsset: {
    discriminator: 1,
    value: TokenStandard_FungibleAsset,
  },
  Fungible: {
    discriminator: 2,
    value: TokenStandard_Fungible,
  },
  NonFungibleEdition: {
    discriminator: 3,
    value: TokenStandard_NonFungibleEdition,
  },
  ProgrammableNonFungible: {
    discriminator: 4,
    value: TokenStandard_ProgrammableNonFungible,
  },
  ProgrammableNonFungibleEdition: {
    discriminator: 5,
    value: TokenStandard_ProgrammableNonFungibleEdition,
  },
});

export type Key_Uninitialized = undefined;

export const Key_Uninitialized = unit;

export type Key_EditionV1 = undefined;

export const Key_EditionV1 = unit;

export type Key_MasterEditionV1 = undefined;

export const Key_MasterEditionV1 = unit;

export type Key_ReservationListV1 = undefined;

export const Key_ReservationListV1 = unit;

export type Key_MetadataV1 = undefined;

export const Key_MetadataV1 = unit;

export type Key_ReservationListV2 = undefined;

export const Key_ReservationListV2 = unit;

export type Key_MasterEditionV2 = undefined;

export const Key_MasterEditionV2 = unit;

export type Key_EditionMarker = undefined;

export const Key_EditionMarker = unit;

export type Key_UseAuthorityRecord = undefined;

export const Key_UseAuthorityRecord = unit;

export type Key_CollectionAuthorityRecord = undefined;

export const Key_CollectionAuthorityRecord = unit;

export type Key_TokenOwnedEscrow = undefined;

export const Key_TokenOwnedEscrow = unit;

export type Key_TokenRecord = undefined;

export const Key_TokenRecord = unit;

export type Key_MetadataDelegate = undefined;

export const Key_MetadataDelegate = unit;

export type Key_EditionMarkerV2 = undefined;

export const Key_EditionMarkerV2 = unit;

export type Key =
  | {
      kind: 'Uninitialized';
      value?: Key_Uninitialized;
    }
  | {
      kind: 'EditionV1';
      value?: Key_EditionV1;
    }
  | {
      kind: 'MasterEditionV1';
      value?: Key_MasterEditionV1;
    }
  | {
      kind: 'ReservationListV1';
      value?: Key_ReservationListV1;
    }
  | {
      kind: 'MetadataV1';
      value?: Key_MetadataV1;
    }
  | {
      kind: 'ReservationListV2';
      value?: Key_ReservationListV2;
    }
  | {
      kind: 'MasterEditionV2';
      value?: Key_MasterEditionV2;
    }
  | {
      kind: 'EditionMarker';
      value?: Key_EditionMarker;
    }
  | {
      kind: 'UseAuthorityRecord';
      value?: Key_UseAuthorityRecord;
    }
  | {
      kind: 'CollectionAuthorityRecord';
      value?: Key_CollectionAuthorityRecord;
    }
  | {
      kind: 'TokenOwnedEscrow';
      value?: Key_TokenOwnedEscrow;
    }
  | {
      kind: 'TokenRecord';
      value?: Key_TokenRecord;
    }
  | {
      kind: 'MetadataDelegate';
      value?: Key_MetadataDelegate;
    }
  | {
      kind: 'EditionMarkerV2';
      value?: Key_EditionMarkerV2;
    };

export const Key: Codec<Key> = sum(1, {
  Uninitialized: {
    discriminator: 0,
    value: Key_Uninitialized,
  },
  EditionV1: {
    discriminator: 1,
    value: Key_EditionV1,
  },
  MasterEditionV1: {
    discriminator: 2,
    value: Key_MasterEditionV1,
  },
  ReservationListV1: {
    discriminator: 3,
    value: Key_ReservationListV1,
  },
  MetadataV1: {
    discriminator: 4,
    value: Key_MetadataV1,
  },
  ReservationListV2: {
    discriminator: 5,
    value: Key_ReservationListV2,
  },
  MasterEditionV2: {
    discriminator: 6,
    value: Key_MasterEditionV2,
  },
  EditionMarker: {
    discriminator: 7,
    value: Key_EditionMarker,
  },
  UseAuthorityRecord: {
    discriminator: 8,
    value: Key_UseAuthorityRecord,
  },
  CollectionAuthorityRecord: {
    discriminator: 9,
    value: Key_CollectionAuthorityRecord,
  },
  TokenOwnedEscrow: {
    discriminator: 10,
    value: Key_TokenOwnedEscrow,
  },
  TokenRecord: {
    discriminator: 11,
    value: Key_TokenRecord,
  },
  MetadataDelegate: {
    discriminator: 12,
    value: Key_MetadataDelegate,
  },
  EditionMarkerV2: {
    discriminator: 13,
    value: Key_EditionMarkerV2,
  },
});

export type CollectionDetails_V1 = {
  size: bigint;
};

export const CollectionDetails_V1 = struct({
  size: u64,
});

export type CollectionDetails = {
  kind: 'V1';
  value: CollectionDetails_V1;
};

export const CollectionDetails: Codec<CollectionDetails> = sum(1, {
  V1: {
    discriminator: 0,
    value: CollectionDetails_V1,
  },
});

export type EscrowAuthority_TokenOwner = undefined;

export const EscrowAuthority_TokenOwner = unit;

export type EscrowAuthority_Creator = [string];

export const EscrowAuthority_Creator = tuple([address]);

export type EscrowAuthority =
  | {
      kind: 'TokenOwner';
      value?: EscrowAuthority_TokenOwner;
    }
  | {
      kind: 'Creator';
      value: EscrowAuthority_Creator;
    };

export const EscrowAuthority: Codec<EscrowAuthority> = sum(1, {
  TokenOwner: {
    discriminator: 0,
    value: EscrowAuthority_TokenOwner,
  },
  Creator: {
    discriminator: 1,
    value: EscrowAuthority_Creator,
  },
});

export type PrintSupply_Zero = undefined;

export const PrintSupply_Zero = unit;

export type PrintSupply_Limited = [bigint];

export const PrintSupply_Limited = tuple([u64]);

export type PrintSupply_Unlimited = undefined;

export const PrintSupply_Unlimited = unit;

export type PrintSupply =
  | {
      kind: 'Zero';
      value?: PrintSupply_Zero;
    }
  | {
      kind: 'Limited';
      value: PrintSupply_Limited;
    }
  | {
      kind: 'Unlimited';
      value?: PrintSupply_Unlimited;
    };

export const PrintSupply: Codec<PrintSupply> = sum(1, {
  Zero: {
    discriminator: 0,
    value: PrintSupply_Zero,
  },
  Limited: {
    discriminator: 1,
    value: PrintSupply_Limited,
  },
  Unlimited: {
    discriminator: 2,
    value: PrintSupply_Unlimited,
  },
});

export type ProgrammableConfig_V1 = {
  ruleSet?: string | undefined;
};

export const ProgrammableConfig_V1 = struct({
  ruleSet: option(address),
});

export type ProgrammableConfig = {
  kind: 'V1';
  value: ProgrammableConfig_V1;
};

export const ProgrammableConfig: Codec<ProgrammableConfig> = sum(1, {
  V1: {
    discriminator: 0,
    value: ProgrammableConfig_V1,
  },
});

export type MigrationType_CollectionV1 = undefined;

export const MigrationType_CollectionV1 = unit;

export type MigrationType_ProgrammableV1 = undefined;

export const MigrationType_ProgrammableV1 = unit;

export type MigrationType =
  | {
      kind: 'CollectionV1';
      value?: MigrationType_CollectionV1;
    }
  | {
      kind: 'ProgrammableV1';
      value?: MigrationType_ProgrammableV1;
    };

export const MigrationType: Codec<MigrationType> = sum(1, {
  CollectionV1: {
    discriminator: 0,
    value: MigrationType_CollectionV1,
  },
  ProgrammableV1: {
    discriminator: 1,
    value: MigrationType_ProgrammableV1,
  },
});

export type TokenState_Unlocked = undefined;

export const TokenState_Unlocked = unit;

export type TokenState_Locked = undefined;

export const TokenState_Locked = unit;

export type TokenState_Listed = undefined;

export const TokenState_Listed = unit;

export type TokenState =
  | {
      kind: 'Unlocked';
      value?: TokenState_Unlocked;
    }
  | {
      kind: 'Locked';
      value?: TokenState_Locked;
    }
  | {
      kind: 'Listed';
      value?: TokenState_Listed;
    };

export const TokenState: Codec<TokenState> = sum(1, {
  Unlocked: {
    discriminator: 0,
    value: TokenState_Unlocked,
  },
  Locked: {
    discriminator: 1,
    value: TokenState_Locked,
  },
  Listed: {
    discriminator: 2,
    value: TokenState_Listed,
  },
});

export type TokenDelegateRole_Sale = undefined;

export const TokenDelegateRole_Sale = unit;

export type TokenDelegateRole_Transfer = undefined;

export const TokenDelegateRole_Transfer = unit;

export type TokenDelegateRole_Utility = undefined;

export const TokenDelegateRole_Utility = unit;

export type TokenDelegateRole_Staking = undefined;

export const TokenDelegateRole_Staking = unit;

export type TokenDelegateRole_Standard = undefined;

export const TokenDelegateRole_Standard = unit;

export type TokenDelegateRole_LockedTransfer = undefined;

export const TokenDelegateRole_LockedTransfer = unit;

export type TokenDelegateRole_Migration = undefined;

export const TokenDelegateRole_Migration = unit;

export type TokenDelegateRole =
  | {
      kind: 'Sale';
      value?: TokenDelegateRole_Sale;
    }
  | {
      kind: 'Transfer';
      value?: TokenDelegateRole_Transfer;
    }
  | {
      kind: 'Utility';
      value?: TokenDelegateRole_Utility;
    }
  | {
      kind: 'Staking';
      value?: TokenDelegateRole_Staking;
    }
  | {
      kind: 'Standard';
      value?: TokenDelegateRole_Standard;
    }
  | {
      kind: 'LockedTransfer';
      value?: TokenDelegateRole_LockedTransfer;
    }
  | {
      kind: 'Migration';
      value?: TokenDelegateRole_Migration;
    };

export const TokenDelegateRole: Codec<TokenDelegateRole> = sum(1, {
  Sale: {
    discriminator: 0,
    value: TokenDelegateRole_Sale,
  },
  Transfer: {
    discriminator: 1,
    value: TokenDelegateRole_Transfer,
  },
  Utility: {
    discriminator: 2,
    value: TokenDelegateRole_Utility,
  },
  Staking: {
    discriminator: 3,
    value: TokenDelegateRole_Staking,
  },
  Standard: {
    discriminator: 4,
    value: TokenDelegateRole_Standard,
  },
  LockedTransfer: {
    discriminator: 5,
    value: TokenDelegateRole_LockedTransfer,
  },
  Migration: {
    discriminator: 6,
    value: TokenDelegateRole_Migration,
  },
});

export type AuthorityType_None = undefined;

export const AuthorityType_None = unit;

export type AuthorityType_Metadata = undefined;

export const AuthorityType_Metadata = unit;

export type AuthorityType_Holder = undefined;

export const AuthorityType_Holder = unit;

export type AuthorityType_MetadataDelegate = undefined;

export const AuthorityType_MetadataDelegate = unit;

export type AuthorityType_TokenDelegate = undefined;

export const AuthorityType_TokenDelegate = unit;

export type AuthorityType =
  | {
      kind: 'None';
      value?: AuthorityType_None;
    }
  | {
      kind: 'Metadata';
      value?: AuthorityType_Metadata;
    }
  | {
      kind: 'Holder';
      value?: AuthorityType_Holder;
    }
  | {
      kind: 'MetadataDelegate';
      value?: AuthorityType_MetadataDelegate;
    }
  | {
      kind: 'TokenDelegate';
      value?: AuthorityType_TokenDelegate;
    };

export const AuthorityType: Codec<AuthorityType> = sum(1, {
  None: {
    discriminator: 0,
    value: AuthorityType_None,
  },
  Metadata: {
    discriminator: 1,
    value: AuthorityType_Metadata,
  },
  Holder: {
    discriminator: 2,
    value: AuthorityType_Holder,
  },
  MetadataDelegate: {
    discriminator: 3,
    value: AuthorityType_MetadataDelegate,
  },
  TokenDelegate: {
    discriminator: 4,
    value: AuthorityType_TokenDelegate,
  },
});

export type PayloadKey_Amount = undefined;

export const PayloadKey_Amount = unit;

export type PayloadKey_Authority = undefined;

export const PayloadKey_Authority = unit;

export type PayloadKey_AuthoritySeeds = undefined;

export const PayloadKey_AuthoritySeeds = unit;

export type PayloadKey_Delegate = undefined;

export const PayloadKey_Delegate = unit;

export type PayloadKey_DelegateSeeds = undefined;

export const PayloadKey_DelegateSeeds = unit;

export type PayloadKey_Destination = undefined;

export const PayloadKey_Destination = unit;

export type PayloadKey_DestinationSeeds = undefined;

export const PayloadKey_DestinationSeeds = unit;

export type PayloadKey_Holder = undefined;

export const PayloadKey_Holder = unit;

export type PayloadKey_Source = undefined;

export const PayloadKey_Source = unit;

export type PayloadKey_SourceSeeds = undefined;

export const PayloadKey_SourceSeeds = unit;

export type PayloadKey =
  | {
      kind: 'Amount';
      value?: PayloadKey_Amount;
    }
  | {
      kind: 'Authority';
      value?: PayloadKey_Authority;
    }
  | {
      kind: 'AuthoritySeeds';
      value?: PayloadKey_AuthoritySeeds;
    }
  | {
      kind: 'Delegate';
      value?: PayloadKey_Delegate;
    }
  | {
      kind: 'DelegateSeeds';
      value?: PayloadKey_DelegateSeeds;
    }
  | {
      kind: 'Destination';
      value?: PayloadKey_Destination;
    }
  | {
      kind: 'DestinationSeeds';
      value?: PayloadKey_DestinationSeeds;
    }
  | {
      kind: 'Holder';
      value?: PayloadKey_Holder;
    }
  | {
      kind: 'Source';
      value?: PayloadKey_Source;
    }
  | {
      kind: 'SourceSeeds';
      value?: PayloadKey_SourceSeeds;
    };

export const PayloadKey: Codec<PayloadKey> = sum(1, {
  Amount: {
    discriminator: 0,
    value: PayloadKey_Amount,
  },
  Authority: {
    discriminator: 1,
    value: PayloadKey_Authority,
  },
  AuthoritySeeds: {
    discriminator: 2,
    value: PayloadKey_AuthoritySeeds,
  },
  Delegate: {
    discriminator: 3,
    value: PayloadKey_Delegate,
  },
  DelegateSeeds: {
    discriminator: 4,
    value: PayloadKey_DelegateSeeds,
  },
  Destination: {
    discriminator: 5,
    value: PayloadKey_Destination,
  },
  DestinationSeeds: {
    discriminator: 6,
    value: PayloadKey_DestinationSeeds,
  },
  Holder: {
    discriminator: 7,
    value: PayloadKey_Holder,
  },
  Source: {
    discriminator: 8,
    value: PayloadKey_Source,
  },
  SourceSeeds: {
    discriminator: 9,
    value: PayloadKey_SourceSeeds,
  },
});

export type PayloadType_Pubkey = [string];

export const PayloadType_Pubkey = tuple([address]);

export type PayloadType_Seeds = [SeedsVec];

export const PayloadType_Seeds = tuple([ref(() => SeedsVec)]);

export type PayloadType_MerkleProof = [LeafInfo];

export const PayloadType_MerkleProof = tuple([ref(() => LeafInfo)]);

export type PayloadType_Number = [bigint];

export const PayloadType_Number = tuple([u64]);

export type PayloadType =
  | {
      kind: 'Pubkey';
      value: PayloadType_Pubkey;
    }
  | {
      kind: 'Seeds';
      value: PayloadType_Seeds;
    }
  | {
      kind: 'MerkleProof';
      value: PayloadType_MerkleProof;
    }
  | {
      kind: 'Number';
      value: PayloadType_Number;
    };

export const PayloadType: Codec<PayloadType> = sum(1, {
  Pubkey: {
    discriminator: 0,
    value: PayloadType_Pubkey,
  },
  Seeds: {
    discriminator: 1,
    value: PayloadType_Seeds,
  },
  MerkleProof: {
    discriminator: 2,
    value: PayloadType_MerkleProof,
  },
  Number: {
    discriminator: 3,
    value: PayloadType_Number,
  },
});

export type UseMethod_Burn = undefined;

export const UseMethod_Burn = unit;

export type UseMethod_Multiple = undefined;

export const UseMethod_Multiple = unit;

export type UseMethod_Single = undefined;

export const UseMethod_Single = unit;

export type UseMethod =
  | {
      kind: 'Burn';
      value?: UseMethod_Burn;
    }
  | {
      kind: 'Multiple';
      value?: UseMethod_Multiple;
    }
  | {
      kind: 'Single';
      value?: UseMethod_Single;
    };

export const UseMethod: Codec<UseMethod> = sum(1, {
  Burn: {
    discriminator: 0,
    value: UseMethod_Burn,
  },
  Multiple: {
    discriminator: 1,
    value: UseMethod_Multiple,
  },
  Single: {
    discriminator: 2,
    value: UseMethod_Single,
  },
});

export type Uninitialized = undefined;

export const Uninitialized: Codec<Uninitialized> = unit;

export interface Edition {
  key: Key;
  parent: string;
  edition: bigint;
}

export const Edition: Codec<Edition> = struct({
  key: ref(() => Key),
  parent: address,
  edition: u64,
});

export interface MasterEditionV1 {
  key: Key;
  supply: bigint;
  maxSupply?: bigint | undefined;
  printingMint: string;
  oneTimePrintingAuthorizationMint: string;
}

export const MasterEditionV1: Codec<MasterEditionV1> = struct({
  key: ref(() => Key),
  supply: u64,
  maxSupply: option(u64),
  printingMint: address,
  oneTimePrintingAuthorizationMint: address,
});

export interface ReservationListV1 {
  key: Key;
  masterEdition: string;
  supplySnapshot?: bigint | undefined;
  reservations: Array<ReservationV1>;
}

export const ReservationListV1: Codec<ReservationListV1> = struct({
  key: ref(() => Key),
  masterEdition: address,
  supplySnapshot: option(u64),
  reservations: array(ref(() => ReservationV1)),
});

export interface Metadata {
  key: Key;
  updateAuthority: string;
  mint: string;
  data: Data;
  primarySaleHappened: boolean;
  isMutable: boolean;
  editionNonce?: number | undefined;
  tokenStandard?: TokenStandard | undefined;
  collection?: Collection | undefined;
  uses?: Uses | undefined;
  collectionDetails?: CollectionDetails | undefined;
  programmableConfig?: ProgrammableConfig | undefined;
}

export const Metadata: Codec<Metadata> = struct({
  key: ref(() => Key),
  updateAuthority: address,
  mint: address,
  data: ref(() => Data),
  primarySaleHappened: bool,
  isMutable: bool,
  editionNonce: option(u8),
  tokenStandard: option(ref(() => TokenStandard)),
  collection: option(ref(() => Collection)),
  uses: option(ref(() => Uses)),
  collectionDetails: option(ref(() => CollectionDetails)),
  programmableConfig: option(ref(() => ProgrammableConfig)),
});

export interface ReservationListV2 {
  key: Key;
  masterEdition: string;
  supplySnapshot?: bigint | undefined;
  reservations: Array<Reservation>;
  totalReservationSpots: bigint;
  currentReservationSpots: bigint;
}

export const ReservationListV2: Codec<ReservationListV2> = struct({
  key: ref(() => Key),
  masterEdition: address,
  supplySnapshot: option(u64),
  reservations: array(ref(() => Reservation)),
  totalReservationSpots: u64,
  currentReservationSpots: u64,
});

export interface MasterEditionV2 {
  key: Key;
  supply: bigint;
  maxSupply?: bigint | undefined;
}

export const MasterEditionV2: Codec<MasterEditionV2> = struct({
  key: ref(() => Key),
  supply: u64,
  maxSupply: option(u64),
});

export interface EditionMarker {
  key: Key;
  ledger: Array<number>;
}

export const EditionMarker: Codec<EditionMarker> = struct({
  key: ref(() => Key),
  ledger: fixedArray(u8, 31),
});

export interface UseAuthorityRecord {
  key: Key;
  allowedUses: bigint;
  bump: number;
}

export const UseAuthorityRecord: Codec<UseAuthorityRecord> = struct({
  key: ref(() => Key),
  allowedUses: u64,
  bump: u8,
});

export interface CollectionAuthorityRecord {
  key: Key;
  bump: number;
  updateAuthority?: string | undefined;
}

export const CollectionAuthorityRecord: Codec<CollectionAuthorityRecord> = struct({
  key: ref(() => Key),
  bump: u8,
  updateAuthority: option(address),
});

export interface TokenOwnedEscrow {
  key: Key;
  baseToken: string;
  authority: EscrowAuthority;
  bump: number;
}

export const TokenOwnedEscrow: Codec<TokenOwnedEscrow> = struct({
  key: ref(() => Key),
  baseToken: address,
  authority: ref(() => EscrowAuthority),
  bump: u8,
});

export interface TokenRecord {
  key: Key;
  bump: number;
  state: TokenState;
  ruleSetRevision?: bigint | undefined;
  delegate?: string | undefined;
  delegateRole?: TokenDelegateRole | undefined;
  lockedTransfer?: string | undefined;
}

export const TokenRecord: Codec<TokenRecord> = struct({
  key: ref(() => Key),
  bump: u8,
  state: ref(() => TokenState),
  ruleSetRevision: option(u64),
  delegate: option(address),
  delegateRole: option(ref(() => TokenDelegateRole)),
  lockedTransfer: option(address),
});

export interface MetadataDelegateRecord {
  key: Key;
  bump: number;
  mint: string;
  delegate: string;
  updateAuthority: string;
}

export const MetadataDelegateRecord: Codec<MetadataDelegateRecord> = struct({
  key: ref(() => Key),
  bump: u8,
  mint: address,
  delegate: address,
  updateAuthority: address,
});

export interface EditionMarkerV2 {
  key: Key;
  ledger: Uint8Array;
}

export const EditionMarkerV2: Codec<EditionMarkerV2> = struct({
  key: ref(() => Key),
  ledger: binary,
});
