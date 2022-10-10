import {SceneTrigger} from "./events";

export const triggerToText = (trigger: SceneTrigger): string => {
    switch (trigger){
        case SceneTrigger.CHOIR:
            return "I've always wanted to start a choir with my friends"
        case SceneTrigger.STUDENT:
            return "Why [did all my friends/did we all] go in different directions"
        case SceneTrigger.DINNER:
            return "I arrive at yours quarter past seven. You make me dinner, we talk about life and everything else. We say it’s funny how we haven’t met in so long. We catch up on lost time like old friends. We say let’s do this again before too much time has passed, knowing we won’t. I leave when it gets too late in the evening"

    }
}

