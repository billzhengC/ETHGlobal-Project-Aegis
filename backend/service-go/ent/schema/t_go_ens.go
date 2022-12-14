// Code generated by entimport, DO NOT EDIT.

package schema

import (
	"entgo.io/ent"
	"entgo.io/ent/dialect/entsql"
	"entgo.io/ent/schema"
	"entgo.io/ent/schema/field"
	"time"
)

type TGoEns struct {
	ent.Schema
}

func (TGoEns) Fields() []ent.Field {
	return []ent.Field{
		field.Uint64("id").Comment("auto increment primary key"),
		field.String("wallet_pub").Unique().Comment("wallet public key"),
		field.String("ens").Default("").Comment("creator of the certificate"),
		field.Time("mtime").Comment("modify time").Default(time.Now()).UpdateDefault(time.Now),
		field.Time("ctime").Comment("create time").Default(time.Now())}
}
func (TGoEns) Edges() []ent.Edge {
	return nil
}
func (TGoEns) Annotations() []schema.Annotation {
	return []schema.Annotation{
		entsql.Annotation{Table: "t_go_ens"},
	}
}
