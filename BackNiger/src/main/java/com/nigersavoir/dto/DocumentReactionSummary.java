package com.nigersavoir.dto;

import com.nigersavoir.entity.DocumentReaction;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DocumentReactionSummary {
    private Long documentId;
    private long likeCount;
    private long dislikeCount;
    private DocumentReaction.ReactionType myReaction;
}
