package com.nigersavoir.dto;

import com.nigersavoir.entity.BookReaction;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookReactionSummary {
    private Long bookId;
    private long likeCount;
    private long dislikeCount;
    private BookReaction.ReactionType myReaction;
}
