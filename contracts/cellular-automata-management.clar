;; Cellular Automata Management Contract

(define-data-var automata-count uint u0)

(define-map cellular-automata
  uint
  {
    creator: principal,
    name: (string-ascii 100),
    description: (string-utf8 1000),
    rules: (list 256 uint),
    dimensions: uint,
    size: uint,
    status: (string-ascii 20)
  }
)

(define-constant CONTRACT_OWNER tx-sender)
(define-constant ERR_NOT_AUTHORIZED (err u403))
(define-constant ERR_INVALID_AUTOMATA (err u404))

(define-public (create-cellular-automata (name (string-ascii 100)) (description (string-utf8 1000)) (rules (list 256 uint)) (dimensions uint) (size uint))
  (let
    (
      (automata-id (+ (var-get automata-count) u1))
    )
    (map-set cellular-automata
      automata-id
      {
        creator: tx-sender,
        name: name,
        description: description,
        rules: rules,
        dimensions: dimensions,
        size: size,
        status: "active"
      }
    )
    (var-set automata-count automata-id)
    (ok automata-id)
  )
)

(define-public (update-automata-status (automata-id uint) (new-status (string-ascii 20)))
  (let
    (
      (automata (unwrap! (map-get? cellular-automata automata-id) ERR_INVALID_AUTOMATA))
    )
    (asserts! (or (is-eq tx-sender CONTRACT_OWNER) (is-eq tx-sender (get creator automata))) ERR_NOT_AUTHORIZED)
    (ok (map-set cellular-automata
      automata-id
      (merge automata { status: new-status })
    ))
  )
)

(define-read-only (get-cellular-automata (automata-id uint))
  (map-get? cellular-automata automata-id)
)

(define-read-only (get-automata-count)
  (var-get automata-count)
)

