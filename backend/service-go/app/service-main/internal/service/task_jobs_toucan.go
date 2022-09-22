package service

import (
	"aegis/app/service-main/graph"
	"aegis/common/library/log"
	"aegis/ent"
	"context"
	"encoding/json"
	"errors"
	"fmt"
)

func (s *MainService) checkAndSaveToucanNCTRetirement(ctx context.Context, retirementList []graph.GetRetirementListRetirementsRetirement) {
	var err error

	addressToTUserMap := make(map[string]*ent.TUser)
	rawAddressToUserMap := s.addressToTUserMap.Load()
	if rawAddressToUserMap == nil {
		err = errors.New("addressToTUserMap not ready")
		log.Errorc(ctx, "[checkAndSaveToucanNCTRetirement] %+v", err)
		return
	}
	var ok bool
	if addressToTUserMap, ok = rawAddressToUserMap.(map[string]*ent.TUser); !ok {
		err = fmt.Errorf("addressToTUserMap type error: %+v", rawAddressToUserMap)
		log.Errorc(ctx, "[checkAndSaveToucanNCTRetirement] %+v", err)
		return
	}

	var count int
	for _, retirement := range retirementList {
		address := retirement.Certificate.Beneficiary.GetId()
		if address == "" || address == _nullAddress {
			address = retirement.Creator.GetId()
		}
		tUser, ok := addressToTUserMap[address]
		if !ok {
			continue
		}
		meta, err := json.Marshal(retirement)
		if err != nil {
			log.Errorc(ctx, "[checkAndSaveToucanNCTRetirement] Marshal meta error: %+v, retirement: %+v", err, retirement)
			continue
		}
		_, err = s.data.DB.ATaskLog.Create().
			SetQuestID(1).
			SetTaskID(1).
			SetMid(tUser.ID).
			SetMeta(string(meta)).
			Save(ctx)
		if err != nil {
			log.Errorc(ctx, "[checkAndSaveToucanNCTRetirement] save task progress error: %+v, user: %+v, retirement: %+v", err, tUser, retirement)
			continue
		}
		count++
	}
	log.Infoc(ctx, "[checkAndSaveToucanNCTRetirement] task progress saved count: %d", count)
}
