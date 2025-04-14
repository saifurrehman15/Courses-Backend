class Queries {
  paginationQuery(query, data, skipsOffset, limitsInNumber, page) {
    return [
      {
        $match: query,
      },
      {
        $facet: {
          metadata: [{ $count: "total" }],
          [data]: [{ $skip: skipsOffset }, { $limit: limitsInNumber }],
        },
      },
      {
        $project: {
          [data]: `$${data}`,
          pagination: {
            total: { $arrayElemAt: ["$metadata.total", 0] },
            page: { $literal: page },
            limit: { $literal: limitsInNumber },
            totalPages: {
              $cond: {
                if: { $gt: [{ $arrayElemAt: ["$metadata.total", 0] }, 0] },
                then: {
                  $ceil: {
                    $divide: [
                      { $arrayElemAt: ["$metadata.total", 0] },
                      limitsInNumber,
                    ],
                  },
                },
                else: 0,
              },
            },
          },
        },
      },
    ];
  }
}

export const dbQueries = new Queries();
