class Queries {
  paginationQuery(
    query,
    data,
    skipsOffset,
    limitsInNumber,
    page,
    ref = "",
    populate = false,
    keyPopulated = "",
    populatePeriod = "before",
    sort = { createdAt: 1 },
    ...queries
  ) {
    console.log(populate, ref, keyPopulated, sort);

    let populated = populate
      ? [
          {
            $lookup: {
              from: ref,
              localField: keyPopulated,
              foreignField: "_id",
              as: keyPopulated,
            },
          },
          { $unwind: `$${keyPopulated}` },
        ]
      : [];

    return [
      ...(populatePeriod === "before" ? populated : []),
      {
        $match: query,
      },
      ...(populatePeriod === "after" ? populated : []),
      { $sort: sort },
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
      ...queries,
    ];
  }
}

export const dbQueries = new Queries();
