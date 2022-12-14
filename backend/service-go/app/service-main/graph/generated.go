// Code generated by github.com/Khan/genqlient, DO NOT EDIT.

package graph

import (
	"context"

	"github.com/Khan/genqlient/graphql"
)

// GetNCTRedeemTokenListRedeemsRedeem includes the requested fields of the GraphQL type Redeem.
type GetNCTRedeemTokenListRedeemsRedeem struct {
	Token GetNCTRedeemTokenListRedeemsRedeemTokenTCO2Token `json:"token"`
}

// GetToken returns GetNCTRedeemTokenListRedeemsRedeem.Token, and is useful for accessing the field via an interface.
func (v *GetNCTRedeemTokenListRedeemsRedeem) GetToken() GetNCTRedeemTokenListRedeemsRedeemTokenTCO2Token {
	return v.Token
}

// GetNCTRedeemTokenListRedeemsRedeemTokenTCO2Token includes the requested fields of the GraphQL type TCO2Token.
type GetNCTRedeemTokenListRedeemsRedeemTokenTCO2Token struct {
	Id string `json:"id"`
}

// GetId returns GetNCTRedeemTokenListRedeemsRedeemTokenTCO2Token.Id, and is useful for accessing the field via an interface.
func (v *GetNCTRedeemTokenListRedeemsRedeemTokenTCO2Token) GetId() string { return v.Id }

// GetNCTRedeemTokenListResponse is returned by GetNCTRedeemTokenList on success.
type GetNCTRedeemTokenListResponse struct {
	Redeems []GetNCTRedeemTokenListRedeemsRedeem `json:"redeems"`
}

// GetRedeems returns GetNCTRedeemTokenListResponse.Redeems, and is useful for accessing the field via an interface.
func (v *GetNCTRedeemTokenListResponse) GetRedeems() []GetNCTRedeemTokenListRedeemsRedeem {
	return v.Redeems
}

// GetRetirementListResponse is returned by GetRetirementList on success.
type GetRetirementListResponse struct {
	Retirements []GetRetirementListRetirementsRetirement `json:"retirements"`
}

// GetRetirements returns GetRetirementListResponse.Retirements, and is useful for accessing the field via an interface.
func (v *GetRetirementListResponse) GetRetirements() []GetRetirementListRetirementsRetirement {
	return v.Retirements
}

// GetRetirementListRetirementsRetirement includes the requested fields of the GraphQL type Retirement.
type GetRetirementListRetirementsRetirement struct {
	CreationTx  string                                               `json:"creationTx"`
	Amount      string                                               `json:"amount"`
	Timestamp   string                                               `json:"timestamp"`
	Token       GetRetirementListRetirementsRetirementTokenTCO2Token `json:"token"`
	Creator     GetRetirementListRetirementsRetirementCreatorUser    `json:"creator"`
	Certificate GetRetirementListRetirementsRetirementCertificate    `json:"certificate"`
}

// GetCreationTx returns GetRetirementListRetirementsRetirement.CreationTx, and is useful for accessing the field via an interface.
func (v *GetRetirementListRetirementsRetirement) GetCreationTx() string { return v.CreationTx }

// GetAmount returns GetRetirementListRetirementsRetirement.Amount, and is useful for accessing the field via an interface.
func (v *GetRetirementListRetirementsRetirement) GetAmount() string { return v.Amount }

// GetTimestamp returns GetRetirementListRetirementsRetirement.Timestamp, and is useful for accessing the field via an interface.
func (v *GetRetirementListRetirementsRetirement) GetTimestamp() string { return v.Timestamp }

// GetToken returns GetRetirementListRetirementsRetirement.Token, and is useful for accessing the field via an interface.
func (v *GetRetirementListRetirementsRetirement) GetToken() GetRetirementListRetirementsRetirementTokenTCO2Token {
	return v.Token
}

// GetCreator returns GetRetirementListRetirementsRetirement.Creator, and is useful for accessing the field via an interface.
func (v *GetRetirementListRetirementsRetirement) GetCreator() GetRetirementListRetirementsRetirementCreatorUser {
	return v.Creator
}

// GetCertificate returns GetRetirementListRetirementsRetirement.Certificate, and is useful for accessing the field via an interface.
func (v *GetRetirementListRetirementsRetirement) GetCertificate() GetRetirementListRetirementsRetirementCertificate {
	return v.Certificate
}

// GetRetirementListRetirementsRetirementCertificate includes the requested fields of the GraphQL type RetirementCertificate.
type GetRetirementListRetirementsRetirementCertificate struct {
	Beneficiary       GetRetirementListRetirementsRetirementCertificateBeneficiaryUser `json:"beneficiary"`
	RetirementMessage string                                                           `json:"retirementMessage"`
}

// GetBeneficiary returns GetRetirementListRetirementsRetirementCertificate.Beneficiary, and is useful for accessing the field via an interface.
func (v *GetRetirementListRetirementsRetirementCertificate) GetBeneficiary() GetRetirementListRetirementsRetirementCertificateBeneficiaryUser {
	return v.Beneficiary
}

// GetRetirementMessage returns GetRetirementListRetirementsRetirementCertificate.RetirementMessage, and is useful for accessing the field via an interface.
func (v *GetRetirementListRetirementsRetirementCertificate) GetRetirementMessage() string {
	return v.RetirementMessage
}

// GetRetirementListRetirementsRetirementCertificateBeneficiaryUser includes the requested fields of the GraphQL type User.
type GetRetirementListRetirementsRetirementCertificateBeneficiaryUser struct {
	Id string `json:"id"`
}

// GetId returns GetRetirementListRetirementsRetirementCertificateBeneficiaryUser.Id, and is useful for accessing the field via an interface.
func (v *GetRetirementListRetirementsRetirementCertificateBeneficiaryUser) GetId() string {
	return v.Id
}

// GetRetirementListRetirementsRetirementCreatorUser includes the requested fields of the GraphQL type User.
type GetRetirementListRetirementsRetirementCreatorUser struct {
	Id string `json:"id"`
}

// GetId returns GetRetirementListRetirementsRetirementCreatorUser.Id, and is useful for accessing the field via an interface.
func (v *GetRetirementListRetirementsRetirementCreatorUser) GetId() string { return v.Id }

// GetRetirementListRetirementsRetirementTokenTCO2Token includes the requested fields of the GraphQL type TCO2Token.
type GetRetirementListRetirementsRetirementTokenTCO2Token struct {
	Name    string `json:"name"`
	Address string `json:"address"`
}

// GetName returns GetRetirementListRetirementsRetirementTokenTCO2Token.Name, and is useful for accessing the field via an interface.
func (v *GetRetirementListRetirementsRetirementTokenTCO2Token) GetName() string { return v.Name }

// GetAddress returns GetRetirementListRetirementsRetirementTokenTCO2Token.Address, and is useful for accessing the field via an interface.
func (v *GetRetirementListRetirementsRetirementTokenTCO2Token) GetAddress() string { return v.Address }

// __GetRetirementListInput is used internally by genqlient
type __GetRetirementListInput struct {
	TokenList []string `json:"tokenList"`
	Skip      int      `json:"skip"`
	PageSize  int      `json:"pageSize"`
}

// GetTokenList returns __GetRetirementListInput.TokenList, and is useful for accessing the field via an interface.
func (v *__GetRetirementListInput) GetTokenList() []string { return v.TokenList }

// GetSkip returns __GetRetirementListInput.Skip, and is useful for accessing the field via an interface.
func (v *__GetRetirementListInput) GetSkip() int { return v.Skip }

// GetPageSize returns __GetRetirementListInput.PageSize, and is useful for accessing the field via an interface.
func (v *__GetRetirementListInput) GetPageSize() int { return v.PageSize }

func GetNCTRedeemTokenList(
	ctx context.Context,
	client graphql.Client,
) (*GetNCTRedeemTokenListResponse, error) {
	req := &graphql.Request{
		OpName: "GetNCTRedeemTokenList",
		Query: `
query GetNCTRedeemTokenList {
	redeems(first: 1000, orderBy: timestamp, orderDirection: desc, where: {pool:"0x7becba11618ca63ead5605de235f6dd3b25c530e"}) {
		token {
			id
		}
	}
}
`,
	}
	var err error

	var data GetNCTRedeemTokenListResponse
	resp := &graphql.Response{Data: &data}

	err = client.MakeRequest(
		ctx,
		req,
		resp,
	)

	return &data, err
}

func GetRetirementList(
	ctx context.Context,
	client graphql.Client,
	tokenList []string,
	skip int,
	pageSize int,
) (*GetRetirementListResponse, error) {
	req := &graphql.Request{
		OpName: "GetRetirementList",
		Query: `
query GetRetirementList ($tokenList: [String!], $skip: Int, $pageSize: Int) {
	retirements(skip: $skip, first: $pageSize, orderBy: timestamp, orderDirection: asc, where: {token_:{address_in:$tokenList}}) {
		creationTx
		amount
		timestamp
		token {
			name
			address
		}
		creator {
			id
		}
		certificate {
			beneficiary {
				id
			}
			retirementMessage
		}
	}
}
`,
		Variables: &__GetRetirementListInput{
			TokenList: tokenList,
			Skip:      skip,
			PageSize:  pageSize,
		},
	}
	var err error

	var data GetRetirementListResponse
	resp := &graphql.Response{Data: &data}

	err = client.MakeRequest(
		ctx,
		req,
		resp,
	)

	return &data, err
}
