package schema

import (
	"entgo.io/ent"
	"entgo.io/ent/dialect/entsql"
	"entgo.io/ent/schema"
	"entgo.io/ent/schema/field"
	"time"
)

type ATaskLog struct {
	ent.Schema
}

func (ATaskLog) Fields() []ent.Field {
	return []ent.Field{
		field.Uint64("id").Comment("auto increment primary key"),
		field.Uint64("quest_id").Default(0).Comment("quest id"),
		field.Uint64("task_id").Default(0).Comment("task id"),
		field.Uint64("mid").Default(0).Comment("user id"),
		field.String("meta").Default("").Comment("meta"),
		field.Time("mtime").Comment("modify time").Default(time.Now()).UpdateDefault(time.Now),
		field.Time("ctime").Comment("create time").Default(time.Now())}
}

func (ATaskLog) Edges() []ent.Edge {
	return nil
}

func (ATaskLog) Annotations() []schema.Annotation {
	return []schema.Annotation{
		entsql.Annotation{
			Table:     "a_task_logs",
			Charset:   "utf8mb4",
			Collation: "utf8mb4_0900_ai_ci",
		},
	}
}
