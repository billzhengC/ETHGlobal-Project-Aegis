// Code generated by ent, DO NOT EDIT.

package ent

import (
	"aegis/ent/atasklog"
	"aegis/ent/predicate"
	"context"
	"fmt"

	"entgo.io/ent/dialect/sql"
	"entgo.io/ent/dialect/sql/sqlgraph"
	"entgo.io/ent/schema/field"
)

// ATaskLogDelete is the builder for deleting a ATaskLog entity.
type ATaskLogDelete struct {
	config
	hooks    []Hook
	mutation *ATaskLogMutation
}

// Where appends a list predicates to the ATaskLogDelete builder.
func (ald *ATaskLogDelete) Where(ps ...predicate.ATaskLog) *ATaskLogDelete {
	ald.mutation.Where(ps...)
	return ald
}

// Exec executes the deletion query and returns how many vertices were deleted.
func (ald *ATaskLogDelete) Exec(ctx context.Context) (int, error) {
	var (
		err      error
		affected int
	)
	if len(ald.hooks) == 0 {
		affected, err = ald.sqlExec(ctx)
	} else {
		var mut Mutator = MutateFunc(func(ctx context.Context, m Mutation) (Value, error) {
			mutation, ok := m.(*ATaskLogMutation)
			if !ok {
				return nil, fmt.Errorf("unexpected mutation type %T", m)
			}
			ald.mutation = mutation
			affected, err = ald.sqlExec(ctx)
			mutation.done = true
			return affected, err
		})
		for i := len(ald.hooks) - 1; i >= 0; i-- {
			if ald.hooks[i] == nil {
				return 0, fmt.Errorf("ent: uninitialized hook (forgotten import ent/runtime?)")
			}
			mut = ald.hooks[i](mut)
		}
		if _, err := mut.Mutate(ctx, ald.mutation); err != nil {
			return 0, err
		}
	}
	return affected, err
}

// ExecX is like Exec, but panics if an error occurs.
func (ald *ATaskLogDelete) ExecX(ctx context.Context) int {
	n, err := ald.Exec(ctx)
	if err != nil {
		panic(err)
	}
	return n
}

func (ald *ATaskLogDelete) sqlExec(ctx context.Context) (int, error) {
	_spec := &sqlgraph.DeleteSpec{
		Node: &sqlgraph.NodeSpec{
			Table: atasklog.Table,
			ID: &sqlgraph.FieldSpec{
				Type:   field.TypeUint64,
				Column: atasklog.FieldID,
			},
		},
	}
	if ps := ald.mutation.predicates; len(ps) > 0 {
		_spec.Predicate = func(selector *sql.Selector) {
			for i := range ps {
				ps[i](selector)
			}
		}
	}
	affected, err := sqlgraph.DeleteNodes(ctx, ald.driver, _spec)
	if err != nil && sqlgraph.IsConstraintError(err) {
		err = &ConstraintError{msg: err.Error(), wrap: err}
	}
	return affected, err
}

// ATaskLogDeleteOne is the builder for deleting a single ATaskLog entity.
type ATaskLogDeleteOne struct {
	ald *ATaskLogDelete
}

// Exec executes the deletion query.
func (aldo *ATaskLogDeleteOne) Exec(ctx context.Context) error {
	n, err := aldo.ald.Exec(ctx)
	switch {
	case err != nil:
		return err
	case n == 0:
		return &NotFoundError{atasklog.Label}
	default:
		return nil
	}
}

// ExecX is like Exec, but panics if an error occurs.
func (aldo *ATaskLogDeleteOne) ExecX(ctx context.Context) {
	aldo.ald.ExecX(ctx)
}
