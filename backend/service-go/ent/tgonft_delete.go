// Code generated by ent, DO NOT EDIT.

package ent

import (
	"aegis/ent/predicate"
	"aegis/ent/tgonft"
	"context"
	"fmt"

	"entgo.io/ent/dialect/sql"
	"entgo.io/ent/dialect/sql/sqlgraph"
	"entgo.io/ent/schema/field"
)

// TGoNFTDelete is the builder for deleting a TGoNFT entity.
type TGoNFTDelete struct {
	config
	hooks    []Hook
	mutation *TGoNFTMutation
}

// Where appends a list predicates to the TGoNFTDelete builder.
func (tnd *TGoNFTDelete) Where(ps ...predicate.TGoNFT) *TGoNFTDelete {
	tnd.mutation.Where(ps...)
	return tnd
}

// Exec executes the deletion query and returns how many vertices were deleted.
func (tnd *TGoNFTDelete) Exec(ctx context.Context) (int, error) {
	var (
		err      error
		affected int
	)
	if len(tnd.hooks) == 0 {
		affected, err = tnd.sqlExec(ctx)
	} else {
		var mut Mutator = MutateFunc(func(ctx context.Context, m Mutation) (Value, error) {
			mutation, ok := m.(*TGoNFTMutation)
			if !ok {
				return nil, fmt.Errorf("unexpected mutation type %T", m)
			}
			tnd.mutation = mutation
			affected, err = tnd.sqlExec(ctx)
			mutation.done = true
			return affected, err
		})
		for i := len(tnd.hooks) - 1; i >= 0; i-- {
			if tnd.hooks[i] == nil {
				return 0, fmt.Errorf("ent: uninitialized hook (forgotten import ent/runtime?)")
			}
			mut = tnd.hooks[i](mut)
		}
		if _, err := mut.Mutate(ctx, tnd.mutation); err != nil {
			return 0, err
		}
	}
	return affected, err
}

// ExecX is like Exec, but panics if an error occurs.
func (tnd *TGoNFTDelete) ExecX(ctx context.Context) int {
	n, err := tnd.Exec(ctx)
	if err != nil {
		panic(err)
	}
	return n
}

func (tnd *TGoNFTDelete) sqlExec(ctx context.Context) (int, error) {
	_spec := &sqlgraph.DeleteSpec{
		Node: &sqlgraph.NodeSpec{
			Table: tgonft.Table,
			ID: &sqlgraph.FieldSpec{
				Type:   field.TypeUint64,
				Column: tgonft.FieldID,
			},
		},
	}
	if ps := tnd.mutation.predicates; len(ps) > 0 {
		_spec.Predicate = func(selector *sql.Selector) {
			for i := range ps {
				ps[i](selector)
			}
		}
	}
	affected, err := sqlgraph.DeleteNodes(ctx, tnd.driver, _spec)
	if err != nil && sqlgraph.IsConstraintError(err) {
		err = &ConstraintError{msg: err.Error(), wrap: err}
	}
	return affected, err
}

// TGoNFTDeleteOne is the builder for deleting a single TGoNFT entity.
type TGoNFTDeleteOne struct {
	tnd *TGoNFTDelete
}

// Exec executes the deletion query.
func (tndo *TGoNFTDeleteOne) Exec(ctx context.Context) error {
	n, err := tndo.tnd.Exec(ctx)
	switch {
	case err != nil:
		return err
	case n == 0:
		return &NotFoundError{tgonft.Label}
	default:
		return nil
	}
}

// ExecX is like Exec, but panics if an error occurs.
func (tndo *TGoNFTDeleteOne) ExecX(ctx context.Context) {
	tndo.tnd.ExecX(ctx)
}
