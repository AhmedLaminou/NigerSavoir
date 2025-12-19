package com.nigersavoir.dto;

import com.nigersavoir.entity.DocumentReaction;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DocumentReactionRequest {
    private DocumentReaction.ReactionType reactionType;
}
