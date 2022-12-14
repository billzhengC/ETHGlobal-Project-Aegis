// Code generated by ent, DO NOT EDIT.

package tgonft

import (
	"time"
)

const (
	// Label holds the string label denoting the tgonft type in the database.
	Label = "tgo_nft"
	// FieldID holds the string denoting the id field in the database.
	FieldID = "id"
	// FieldWalletPub holds the string denoting the wallet_pub field in the database.
	FieldWalletPub = "wallet_pub"
	// FieldRankType holds the string denoting the rank_type field in the database.
	FieldRankType = "rank_type"
	// FieldRankYear holds the string denoting the rank_year field in the database.
	FieldRankYear = "rank_year"
	// FieldRankSeason holds the string denoting the rank_season field in the database.
	FieldRankSeason = "rank_season"
	// FieldRank holds the string denoting the rank field in the database.
	FieldRank = "rank"
	// FieldMintTx holds the string denoting the mint_tx field in the database.
	FieldMintTx = "mint_tx"
	// FieldMtime holds the string denoting the mtime field in the database.
	FieldMtime = "mtime"
	// FieldCtime holds the string denoting the ctime field in the database.
	FieldCtime = "ctime"
	// Table holds the table name of the tgonft in the database.
	Table = "t_go_nfts"
)

// Columns holds all SQL columns for tgonft fields.
var Columns = []string{
	FieldID,
	FieldWalletPub,
	FieldRankType,
	FieldRankYear,
	FieldRankSeason,
	FieldRank,
	FieldMintTx,
	FieldMtime,
	FieldCtime,
}

// ValidColumn reports if the column name is valid (part of the table columns).
func ValidColumn(column string) bool {
	for i := range Columns {
		if column == Columns[i] {
			return true
		}
	}
	return false
}

var (
	// DefaultWalletPub holds the default value on creation for the "wallet_pub" field.
	DefaultWalletPub string
	// DefaultRankType holds the default value on creation for the "rank_type" field.
	DefaultRankType int
	// DefaultRankYear holds the default value on creation for the "rank_year" field.
	DefaultRankYear int
	// DefaultRankSeason holds the default value on creation for the "rank_season" field.
	DefaultRankSeason int
	// DefaultRank holds the default value on creation for the "rank" field.
	DefaultRank int
	// DefaultMintTx holds the default value on creation for the "mint_tx" field.
	DefaultMintTx string
	// DefaultMtime holds the default value on creation for the "mtime" field.
	DefaultMtime time.Time
	// UpdateDefaultMtime holds the default value on update for the "mtime" field.
	UpdateDefaultMtime func() time.Time
	// DefaultCtime holds the default value on creation for the "ctime" field.
	DefaultCtime time.Time
)
